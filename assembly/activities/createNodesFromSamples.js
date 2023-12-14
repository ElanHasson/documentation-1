import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import rangeParser from "parse-numeric-range";
import graymatter from "gray-matter";

// const docsAsSourceRegex =
//   "(?:@dacx\\n)(id:.*)(?:\\n)(title:.*)(?:\\n)(label:.*)(?:\\n)(description:.*)(?:\\n)(lines:.*)(?:\\n)(tags:.*)(?:\\n@dacx)";
const docsAsSourceRegex = '(?:\\/\\*\\s*@dacx|"""\\s*@dacx)((?:.|\\n)*?)(?:@dacx\\s*\\*\\/|@dacx\\s*""")';
const docsAsSource = RegExp(docsAsSourceRegex, "gm");
const codeBlocks = "```";

export async function createNodesFromSamples(config) {
  console.log("creating nodes from samples...");
  const readPath = path.join(config.root_dir, config.temp_write_dir, config.samples_file_paths_filename);
  const filePaths = await fs.readJSON(readPath);
  for (const repoPaths of filePaths) {
    for (const file of repoPaths.repo_files) {
      const ext = path.extname(file.name);
      let lang = ext.slice(1);
      if (isDACX(file.name, config, file) && isSupportedExtension(ext)) {
        const sourceURL = parseURL(repoPaths.source_url, file);
        if (ext === ".py") {
          lang = "python";
        }
        if (ext === ".ts") {
          lang = "typescript";
        }
        await createNodes(config, file, lang, sourceURL);
      }
    }
  }
  async function createNodes(config, file, lang, sourceURL) {
    const sampleFileReadPath = path.join(config.root_dir, config.temp_write_dir, file.directory, file.name);
    const raw = await fs.readFile(sampleFileReadPath);
    const contents = raw.toString("utf8");
    const fileLines = contents.split("\n");
    const nodeData = findMetaData(contents);
    if (nodeData.length > 0) {
      const nodes = await parseData(nodeData, fileLines, lang);
      await writeNodes(nodes, config, sourceURL);
    }
  }

  async function writeNodes(nodes, config, sourceURL) {
    for (const node of nodes) {
      let writeStr = "";
      writeStr = `${writeStr}---\n`;
      writeStr = `${writeStr}id: ${node.metadata.id}\n`;
      writeStr = `${writeStr}title: ${node.metadata.title}\n`;
      writeStr = `${writeStr}sidebar_label: ${node.metadata.label}\n`;
      writeStr = `${writeStr}description: ${node.metadata.description}\n`;
      if (node.metadata.tags.length > 0) {
        writeStr = `${writeStr}tags:\n`;
        for (const tag of node.metadata.tags) {
          writeStr = `${writeStr}- ${tag}\n`;
        }
      }
      writeStr = `${writeStr}---\n\n`;
      writeStr = `${writeStr}<!-- DO NOT EDIT THIS FILE DIRECTLY.\nTHIS FILE IS GENERATED from ${sourceURL}. -->\n\n`;
      for (const narLine of node.narrative_lines) {
        writeStr = `${writeStr}${narLine}\n`;
      }
      if (node.code_lines.length > 0) {
        writeStr = `${writeStr}\n`;
        writeStr = `${writeStr}${genSourceLinkHTML(sourceURL)}\n\n`;
        writeStr = `${writeStr}${codeBlocks}${node.metadata.lang}\n\n`;
        for (const codeLine of node.code_lines) {
          writeStr = `${writeStr}${codeLine}\n`;
        }
        writeStr = `${writeStr}${codeBlocks}\n\n`;
      }
      const nodeWritePath = path.join(
        config.root_dir,
        config.docs_src,
        `${node.metadata.lang}`,
        "generated",
        `${node.metadata.id}.md`
      );
      await fs.writeFile(nodeWritePath, writeStr);
    }
  }

  async function parseData(nodeData, fileLines, lang) {
    const nodes = [];
    for (const match of nodeData) {
      const node = {};
      let tags = match.data.tags;
      //const tagArray = tags.split(",").map((tag) => tag.trim());
      node.metadata = {
        id: match.data.id,
        title: match.data.title,
        label: match.data.label,
        description: match.data.description,
        lines: rangeParser(match.data.lines),
        tags: match.data.tags || [],
        lang: lang,
      };
      node.inverse_content = [];
      let previousNum = 0;
      for (const lineNum of node.metadata.lines) {
        if (previousNum == 0) {
          node.inverse_content.push(fileLines[lineNum - 1]);
          previousNum = lineNum;
        } else {
          if (lineNum - previousNum > 1) {
            node.inverse_content.push(lang === "python" ? "# ..." : "// ...");
          }
          node.inverse_content.push(fileLines[lineNum - 1]);
          previousNum = lineNum;
        }
      }
      node.narrative_lines = [];
      node.code_lines = [];
      let codeMode = true;
      let skip = false;
      for (const invLine of node.inverse_content) {
        if (isMultilineStart(invLine)) {
          codeMode = false;
          skip = true;
        }
        if (isMultilineEnd(invLine)) {
          codeMode = true;
          skip = true;
        }
        if (!skip && !codeMode) {
          node.narrative_lines.push(invLine);
        }
        if (!skip && codeMode) {
          node.code_lines.push(invLine);
        }
        skip = false;
      }
      nodes.push(node);
    }
    return nodes;
  }

  function isMultilineStart(invLine) {
    if (invLine.includes("/*") || invLine.includes('"""dacx')) {
      return true;
    }
    return false;
  }

  function isMultilineEnd(invLine) {
    if (invLine.includes("*/") || invLine.includes('dacx"""')) {
      return true;
    }
    return false;
  }

  function findMetaData(contents) {
    const dacMatches = [];
    let data;
    while ((data = docsAsSource.exec(contents)) !== null) {
      const matter = graymatter(`---${data[1]}---`);
      dacMatches.push(matter);
    }

    return dacMatches;
  }

  function isSupportedExtension(ext) {
    const supportedExts = [".go", ".py", ".java", ".ts"];
    return supportedExts.includes(ext);
  }

  function isDACX(str, config, file) {
    str = str.toLowerCase(); // Remember to assign the result back to str
    if (str.includes("_dacx")) {
      return true;
    } else if (isSupportedExtension(path.extname(str))) {
      console.log(JSON.stringify(file));
      const readPath = path.join(config.root_dir, config.temp_write_dir, file.directory, file.name);
      try {
        const fileContent = fs.readFileSync(readPath, "utf-8");
        const firstLine = fileContent.split("\n")[0]; // Get the first line of the file
        if (firstLine.includes("dacx")) {
          return true;
        }
      } catch (err) {
        console.error("File failed to load:", err);
      }
    } else {
      return false;
    }
  }

  function parseURL(repoPath, file) {
    const parts = file.directory.split("/");
    const dirParts = parts.slice(1);
    const directory = path.join(...dirParts);
    const sourceURL = repoPath + "/" + path.join(directory, file.name);
    return sourceURL;
  }

  function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h;
  }

  function genSourceLinkHTML(link) {
    // Generate a deterministic id based on the hash of the link
    const id = "id" + hashCode(link).toString();
    return `<div class="copycode-notice-container"><div class="copycode-notice"><img data-style="copycode-icon" src="/icons/copycode.png" alt="Copy code icon" /> Sample application code information <img id="i-${id}" data-event="clickable-copycode-info" data-style="chevron-icon" src="/icons/chevron.png" alt="Chevron icon" /></div><div id="copycode-info-${id}" class="copycode-info">The following code sample comes from a working and tested sample application. The code sample might be abridged within the guide to highlight key aspects. Visit the source repository to <a href="${link}">view the source code</a> in the context of the rest of the application code.</div></div>`;
  }
}
