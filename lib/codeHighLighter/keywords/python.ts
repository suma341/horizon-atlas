type CodeKeyWord={
    purpleWords:string[]
    yellowWords:string[]
    skyWords:string[]
    redWords:string[]
}

// 紫 (構文キーワード)
const purpleWords = [
  "def", "class", "return", "import", "from", "as", "lambda",
  "if", "else", "elif", "not", "for", "in", "while", "try",
  "except", "finally", "with", "pass", "break", "continue",
  "yield", "assert", "del", "global", "nonlocal", "raise",
  "await", "async", "or", "and", "is"
];

// 黄色 (よく使う組み込み関数)
const yellowWords = [
  "print", "input", "str", "int", "float", "list", "dict",
  "set", "tuple", "len", "range", "open", "type", "dir",
  "help", "enumerate", "zip", "map", "filter", "sum", "min",
  "max", "any", "all", "sorted"
];

// 水色 (定数値)
const skyWords = [
  "True", "False", "None"
];

// 赤 (例外クラス)
const redWords = [
  "Exception", "ValueError", "TypeError", "NameError", "IndexError",
  "KeyError", "ZeroDivisionError", "ImportError", "FileNotFoundError"
];

export const pythonKeyWords:CodeKeyWord={
    purpleWords,
    yellowWords,
    skyWords,
    redWords
}