/**
 * Windows環境でのファイル名制約に対応するユーティリティ関数
 * 
 * Windowsでは以下の文字がファイル名に使用できません：
 * - < > : " / \ | ? *
 * - また、末尾のスペースやピリオドも問題になることがあります
 */

const path = require('path');

/**
 * ファイル名として使用できない文字を安全な文字に置換する
 * @param {string} filename - サニタイズするファイル名
 * @param {string} replacement - 置換文字（デフォルト: '_'）
 * @returns {string} サニタイズされたファイル名
 */
function sanitizeFilename(filename, replacement = '_') {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  // Windowsで使用できない文字を置換
  // < > : " / \ | ? *
  let sanitized = filename.replace(/[<>:"/\\|?*]/g, replacement);

  // 末尾のスペースやピリオドを削除（Windowsの制約）
  sanitized = sanitized.replace(/[\s.]+$/g, '');

  // 連続する置換文字を1つにまとめる
  sanitized = sanitized.replace(new RegExp(`\\${replacement}+`, 'g'), replacement);

  // 先頭の置換文字を削除（見た目を良くするため）
  sanitized = sanitized.replace(new RegExp(`^\\${replacement}+`, 'g'), '');

  // 空文字列の場合はデフォルト値を返す
  if (!sanitized) {
    return 'file';
  }

  // ファイル名の長さ制限（WindowsのMAX_PATHは260文字だが、安全のため255文字に制限）
  if (sanitized.length > 255) {
    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);
    const maxNameLength = 255 - ext.length;
    sanitized = nameWithoutExt.substring(0, maxNameLength) + ext;
  }

  return sanitized;
}

/**
 * Gitのブランチ名やコミットメッセージからファイル名を生成する際に使用
 * @param {string} input - 入力文字列（ブランチ名、コミットメッセージなど）
 * @returns {string} サニタイズされたファイル名
 */
function sanitizeForFilename(input) {
  return sanitizeFilename(input, '_');
}

module.exports = {
  sanitizeFilename,
  sanitizeForFilename
};
