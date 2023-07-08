class FileSystemCLI {
    // 初期化
    constructor() {
      this.cliHistory      = [];
      this.cliHistoryIndex = -1;
      this.fs              = new FileSystem();
      this.validCommands   = this.fs.getValidCommands();
    }
  
    // 入力値からcliHistory、cliHistoryIndexの値を更新する関数
    addCLIHistory(inputString) {
      this.cliHistory.push(inputString);
      this.cliHistoryIndex = this.cliHistory.length - 1;
    }
  
    // 入力値を解析する関数
    commandLineParser(inputString) {
      let tokenArray = inputString.trim().split(" ");
      let tokens = [];
  
      for (let i = 0; i < 3; i++) {
        tokens[i] = tokenArray[i] === undefined ? "" : tokenArray[i];
      }
  
      return tokens;
    }
    
    // 入力値の引数バリデーションチェック関数
    inputStringValidator(inputString) {
      let tokens = inputString.trim().split(" ");
      // 各コマンドの引数は1以上3以下、それ以外は引数エラーとなる
      if (tokens.length < 1 || tokens.length > 3) {
        return new ValidatorResponse(false, `Invalid number of tokens.`);
      }
      return this.tokenValidator(this.commandLineParser(inputString));
    }
  
    tokenValidator(CLITokens) {
      let cmd = CLITokens[0];
      let arg = CLITokens[1];
  
      if (this.validCommands.indexOf(cmd) == -1) {
        return new ValidatorResponse(false, `Command must be one of the following: ${this.validCommands.join(",")}`);
      }
  
      if (cmd == 'pwd') {
        return new ValidatorResponse(true, '');
      }
  
      if (cmd == 'ls') {
        return this.pathToValidatorResponse(arg);
      }
  
      if (cmd == 'cd') {
        return this.checkNodeTypeValidator(arg, 'dir');
      }
  
      if (cmd == 'print' || cmd == 'setContent') {
        return this.checkNodeTypeValidator(arg, 'file');
      }
  
      if (cmd == 'touch') {
        if (this.fs.hasFileOrDirByStringPath(arg)) {
            return new ValidatorResponse(true, '');
        } else {
            return this.targetDirCreationPathToValidatorResponse(arg);
        }
      }
  
      if (cmd == 'mkdir') {
        if (this.fs.hasFileOrDirByStringPath(arg)) {
            return new ValidatorResponse(false, `File or directory already exists: ${arg}`);
        } else {
            return this.targetDirCreationPathToValidatorResponse(arg);
        }
      }
  
      if (cmd == 'rm') {
        // rmのバリデーションは今のところ特になし
        // return new ValidatorResponse(true, '');
      }
  
      return new ValidatorResponse(true, '');
    }
  
  //   checkNodeTypeValidator(path, type) {
  //       if (!this.fs.hasFileOrDirByStringPath(path)) {
  //           return new ValidatorResponse(false, `No such file or directory with path ${path}`);
  //       }
  // alert(10)
  //       const nodeType = this.fs.getNodeTypeByStringPath(path);
  
  //       if (nodeType !== type) {
  //           return new ValidatorResponse(false, `Path ${path} is not a ${type}`);
  //       }
  
  //       return new ValidatorResponse(true, '');
  //   }
  
    targetDirCreationPathToValidatorResponse(targetDirCreationPath) {
        const parentDirPath = this.fs.getParentDirectoryPath(targetDirCreationPath);
  
        if (!this.fs.exists(parentDirPath)) {
            return new ValidatorResponse(false, `Parent directory does not exist.`);
        }
  
        const fileName = this.fs.getDirectoryNameFromPath(targetDirCreationPath);
  
        if (!this.fs.isValidName(fileName)) {
            return new ValidatorResponse(false, `Invalid file name.`);
        }
  
        return new ValidatorResponse(true, '');
    }
    pathToValidatorResponse(path) {
      return this.fs.hasFileOrDirByStringPath(path) ? new ValidatorResponse(true, '') : new ValidatorResponse(false, `No such file or directory with path ${path}`);
    }
  
    stringFileOrDirNameToValidatorResponse(name) {
        return /[^a-zA-Z0-9\s]/.test(name) ? new aValidatorResponse(false, `File name may only contain characters from a-z, A-Z, and 0-9`) : new ValidatorResponse(true, '');
    }
  
    checkNodeTypeValidator(path, type) {
      let res = this.pathToValidatorResponse(path);
  
      if (!res.isValid) {
        return res;
      }
  
      // 操作するタイプが違う場合はエラー処理
      if (this.fs.getFileOrDirByStringPath(path).getType() !== type) {
        return new ValidatorResponse(false, `${path} is not a ${type}.`);
      }
  
      return new ValidatorResponse(true, '');
    }
  
    targetDirCreationPathToValidatorResponse(stringPath) {
      let dirPathAndFileName = this.fs.getDirPathAndFileName(stringPath);
  
      if (!this.fs.hasFileOrDirByStringPath(dirPathAndFileName[0])) {
          return new ValidatorResponse(false, `No such target directory ${dirPathAndFileName[0]}`);
      }
  
      if (this.fs.getFileOrDirByStringPath(dirPathAndFileName[0]).getType() !== 'dir') {
          return new ValidatorResponse(false, `Target node ${dirPathAndFileName[0]} is not a directory`);
      }
  
      return this.stringFileOrDirNameToValidatorResponse(dirPathAndFileName[1]);
    }
  
    parsedStringTokenHandler(parsedStringTokenArray) {
      let cmd = parsedStringTokenArray[0];
      let stringPath = parsedStringTokenArray[1];
      let arg = parsedStringTokenArray[2];
  
      if (cmd === 'ls') {
          return this.fs.ls(stringPath);
      }
      if (cmd === 'touch') {
          return this.fs.touch(stringPath, arg);
      }
      if (cmd === 'mkdir') {
          return this.fs.mkdir(stringPath);
      }
      if (cmd === 'cd') {
          return this.fs.cd(stringPath);
      }
      if (cmd === 'rm') {
          return this.fs.rm(stringPath);
      }
      if (cmd === 'pwd') {
          return this.fs.pwd();
      }
      if (cmd === 'print') {
          return this.fs.print(stringPath);
      }
      if (cmd === 'setContent') {
          return this.fs.setContent(stringPath, arg);
      }
    }
  
    appendParagraph(div) {
      div.innerHTML +=
        `<p class="m-0"> 
          <span style='color:lime'>root</span>
          <span style='color:yellow'>@</span>
          <span style='color:aqua'>root: $</span>
          <span style='color:turquoise'> ${this.fs.pwd()} </span>
          : ${CLITextInput.value} 
        </p>`;
      return;
    }
  
    appendResultParagraph(div, isValid, message) {
      let textColorString = isValid ? "white" : "red";
      div.innerHTML +=
        `<p class="m-0" style="color: ${textColorString}">
          ${message}
        </p>`;
      return; 
    }
  }
  
  // ファイルシステムクラス
  class FileSystem {
    constructor() {
      this.root = new Node("/", "dir");
      this.currentDir = this.root;
      this.validCommands = ['ls', 'pwd', 'touch', 'cd', 'mkdir', 'print', 'setContent', 'rm'];
    }
  
    getValidCommands() {
      return this.validCommands;
    }
  
    ls(path) {
      let node = this.getFileOrDirByStringPath(path);
      if (node.isFile()) return node.getFileListingAsString() + "<br>";
      else return node.getListsOfChildren().join("<br>"); // ディレクトリの場合は、子ノードを再起的に全て取得
    }
  
    touch(path) {
      if (this.hasFileOrDirByStringPath(path)) {
        this.getFileOrDirByStringPath(path).setDateModifiedToCurrentDate();
        return `1 file's date updated: ${path} `;
      }
  
      let dirPathAndFileName = this.getDirPathAndFileName(path);
      let parentDirPath = dirPathAndFileName[0];
      let fileName = dirPathAndFileName[1];
      let parentDir = this.getFileOrDirByStringPath(parentDirPath);
  
      parentDir.addChild(new Node(fileName, 'file', parentDir, ""));
      return `1 new file added: ${path}`;
    }
  
    mkdir(path) {
      let parentDirPathAndFileName = this.getDirPathAndFileName(path);
      let parentDirPath = parentDirPathAndFileName[0];
      let dirName = parentDirPathAndFileName[1];
      let parentDir = this.getFileOrDirByStringPath(parentDirPath);
      parentDir.addChild(new Node(dirName, 'dir', parentDir));
  
      return `1 new directory added: ${path}`;
    }
  
    cd(path) {
      this.currentDir = this.getFileOrDirByStringPath(path);
      return `changing directory to ${path}`;
    }
  
    pwd() {
      return this.currentDir.getFullPath();
    }
  
    rm(path) {
      let pathTokens = this.pathTokenArray(path);
      let fileName = pathTokens[pathTokens.length-1];
      this.getFileOrDirByStringPath(path).getParent().removeChildByName(fileName);
      return `removed file or directory ${path}`;
    }
  
    print(path) {
      return this.getFileOrDirByStringPath(path).getContent();
    }
  
    setContent(path, newContent) {
      this.getFileOrDirByStringPath(path).setContent(newContent);
      return `set content of ${path} to ${newContent}`;
    }
  
    // パス操作をする関数
    pathTokenArray(path) {
      if (path == "/") return ["/"];
  
      if (path.indexOf("/") == -1) return [path];
  
      let tokens = [];
      if (path[path.length -1] == "/") path = path.substring(0,path.length-1);
  
      if (path[0] == "/") {
        path = path.substring(1);
        tokens.push("/");
      }
      tokens = tokens.concat(path.split("/"));
  
      return tokens;
    }
  
    hasFileOrDirByStringPath(path) {
      let pathTokens = this.pathTokenArray(path);
  
      if (pathTokens.length == 0) return false;
  
      if (pathTokens.length == 1 && pathTokens[0] == "/") return true;
  
      if (pathTokens.length == 1 && pathTokens[0] == "") return true;
  
      if (pathTokens.length == 1 && pathTokens[0] == ".." && !this.currentDir.isRoot()) return true;
  
      let curNode = {};
  
      if (pathTokens[0] == '/') {
        curNode = this.root;
        pathTokens.shift();
      } else {
          curNode = this.currentDir;
      }
  
      while (pathTokens.length > 0) {
        let childName = pathTokens.shift();
  
        if (childName == ".." && !curNode.isRoot()) {
            curNode = curNode.getParent();
        } else if (curNode.hasImmediateChildWithName(childName)) { // 引数の子ノードが存在する場合、カレントノードを子ノードにする
            curNode = curNode.getChild(childName);
        } else {
            return false;
        }
      }
  
      return true;
    }
  
    // パスからノードを返す関数
    getFileOrDirByStringPath(path) {
      let pathTokens = this.pathTokenArray(path);
  
      if (pathTokens.length == 0) return null;
  
      // ルート
      if (pathTokens.length == 1 && pathTokens[0] == "/") return this.root;
  
      // 作業ディレクトリ
      if (pathTokens.length == 1 && pathTokens[0] == "") return this.currentDir;
  
      // 親ディレクトリ
      if (pathTokens.length == 1 && pathTokens[0] == "..") return this.currentDir.getParent();
  
      let curNode = {};
  
      // '/'の場合は、ノードをルートにする
      if (pathTokens[0] == '/') {
        curNode = this.root;
        pathTokens.shift();
      } else {
        curNode = this.currentDir;
      }
  
      while (pathTokens.length > 0) {
        let childName = pathTokens.shift();
  
        if (childName == '..') {
          curNode = curNode.getParent();
        } else if (childName == '/') {
          curNode = this.root;
        } else {
          curNode = curNode.getChild(childName);
        }
      }
  
      return curNode;
    }
  
    // "/" -> ["", ""]、"/dir/file.txt" -> ["/dir", "file.txt"]、"dir1/dir2/file" -> ["dir1/dir2", "file"]、"file.txt" -> ["", "file.txt"]、"dir/" -> ["", "dir"]
    // 引数を元に0番目の要素がディレクトリ、1番目の要素がファイルを表す配列を返す
    getDirPathAndFileName(path) {
      let dirPathAndFileName = [];
  
      // 末尾の"/”を削除
      if (path[path.length - 1] == "/") {
        path = path.substring(0, path.length - 1);
      }
  
      dirPathAndFileName[0] = path.substring(0, path.lastIndexOf("/"));
      dirPathAndFileName[1] = path.substring(path.lastIndexOf("/") + 1);
  
      return dirPathAndFileName;
    }
  }
  
  // ノードクラス
  class Node {
    constructor(name, type, parent = null, content = "") {
      this.name = name;
      this.type = type;
      this.parent = parent;     // 親ノードを指すポインタ
      this.childHead = null;    // 最初の子ノードを指すポインタ
      this.nextSibling = null;  // 同じ親を持つノードの中で、現在のノードの直後にあるノードを指すポインタ
      this.content = content;
      this.dateModified = new Date();
  
      // Node A
      //   |
      //   V
      // Node B -> Node C -> Node D -> Node E
      // Node Aが親である場合、Node AのchildHeadがNode Bを指し、Node BのnextSiblingがNode Cを指し、Node CのnextSiblingがNode Dを指し、Node DのnextSiblingがNode Eを指す
    }
  
    // ルートノードか
    isRoot() {
      return this.parent == null;
    }
  
    // タイプがファイルか
    isFile() {
      return this.type == 'file';
    }
  
    // タイプがディレクトリか
    isDir() {
      return this.type == 'dir';
    }
  
    // 子ノードがあるか(引数なし)
    hasChildren() {
      return this.childHead != null;
    }
  
    // 指定した子ノードがあるか
    hasImmediateChildWithName(childName) {
      let curChild = this.childHead;
      while (curChild != null) {
        if (curChild.name == childName) return true;
        curChild = curChild.nextSibling; // 兄弟ノードを探索
      }
      return false;
    }
  
    // 引数の子ノードがノード上に存在するならそのノードを返す関数
    getChild(childName) {
      let curChild = this.childHead;
      while (curChild != null) {
        if (curChild.name == childName) return curChild;
        curChild = curChild.nextSibling;
      }
      return null;
    }
  
    // コンテンツを取得
    getContent() {
      return this.content;
    }
  
    // 名前を取得
    getName() {
      return this.name;
    }
  
    // タイプを取得
    getType() {
      return this.type;
    }
  
    // 親ノードを取得
    getParent() {
      return this.parent;
    }
  
    // 末端の子ノードを取得
    getChildTail() {
      let curChild = this.childHead;
      while (curChild.nextSibling != null) {
          curChild = curChild.nextSibling; 
      }
      return curChild; 
    }
  
    // 日時を文字列化
    getDateModifiedAsString(){
      const date = this.dateModified;
      return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes();
    }
  
    // ファイル表示用関数
    getFileListingAsString(){
      return `${this.getDateModifiedAsString()} ${this.getType()} ${this.getName()}`
    }
  
    // ファイル作成時、更新日時を現在日時にする
    setDateModifiedToCurrentDate(){
      this.dateModified = new Date();
    }
  
    // 名前更新
    setName(newName){
      this.name = newName;
    }
  
    // コンテンツ更新
    setContent(newContent){
      this.content = newContent;
    }
  
    // 子ノード追加
    addChild(newChildNode){
      if (!this.hasChildren()) this.childHead = newChildNode; // 子ノードがない場合は、先頭の子ノードに追加
      else this.getChildTail().nextSibling = newChildNode;    // 子ノードがある場合は、末端の子ノードに追加
    }
  
    // 子ノード削除
    removeChildByName(childName){ 
      if (!this.hasChildren()) return;
      if (this.childHead.name == childName){ 
        this.childHead = this.childHead.nextSibling; 
        return;
      }
      
      let prevSibling = this.childHead;
      let curSibling = this.childHead.nextSibling; 
      
      while (curSibling.name != childName){
        prevSibling = curSibling;
        curSibling = curSibling.nextSibling;  
      }
      
      prevSibling.nextSibling = curSibling.nextSibling; 
    }
  
    // 全ての子ノードを表示(親ノードがディレクトリ時使用)
    getListsOfChildren(){
      let fileListings = [];
      let curNode = this.childHead;
      while (curNode != null){
        fileListings.push(curNode.getFileListingAsString());
        curNode = curNode.nextSibling; 
      }
      return fileListings; 
    }
  
    // ルートディレクトリからの絶対パスを取得
    getFullPath(){
      if (this.parent == null) return "/";
      let path = (this.type == 'dir') ? this.name +"/" : this.name;
      let parentNode = this.parent;
      // 親ノードが続く間、パスを更新
      while (parentNode.parent != null){
        path = parentNode.name + "/" + path;
        parentNode = parentNode.parent; 
      }
      return "/"+path;
    }
  }
  
  // バリデーションクラス
  class ValidatorResponse{
    constructor(isValid = false, errorMessage=""){
      this.isValid = isValid;
      this.errorMessage = errorMessage;
    }
  
    getIsValid(){
      return this.isValid;
    }
  
    getErrorMessage(){
      return this.errorMessage;
    }
  }
  
  let CLITextInput = document.getElementById("CLITextInput");
  let CLIOutputDiv = document.getElementById("CLIOutputDiv");
  
  CLITextInput.addEventListener("keyup", function(event) {
    submitCLIInput(event);
  });
  
  let fsCLI = new FileSystemCLI(); // FileSystemCLIインスタンス作成
  function submitCLIInput(event) {
    if (event.key == "Enter") {
      fsCLI.appendParagraph(CLIOutputDiv); // 入力値を元に、Paragraphを追加
  
      let CLIInputString = CLITextInput.value.trim();
      fsCLI.addCLIHistory(CLIInputString); // FileSystemCLIインスタンス更新関数を実行
  
      let validator = fsCLI.inputStringValidator(CLIInputString);
      console.log(validator)
      if (validator.isValid) {
        fsCLI.appendResultParagraph(CLIOutputDiv, true, fsCLI.parsedStringTokenHandler(fsCLI.commandLineParser(CLIInputString)));
      } else {
        fsCLI.appendResultParagraph(CLIOutputDiv, false, validator.errorMessage);
      }
  
      CLITextInput.value = "";
      CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
    }
  }
  