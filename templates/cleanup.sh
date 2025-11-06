#!/bin/bash
# クリーンアップチェックスクリプト（テンプレート）
# プロジェクトの言語/フレームワークに応じてカスタマイズしてください

set -e

echo "🔍 クリーンアップチェックを開始..."

# デバッグコードの検出（言語別）
check_debug_code() {
  local lang=$1
  local pattern=$2
  local paths=$3
  
  echo "  ├─ ${lang}: デバッグコードをチェック..."
  if grep -rn "$pattern" $paths 2>/dev/null | grep -v "cleanup.sh"; then
    echo "  ❌ デバッグコード（${pattern}）が残っています"
    return 1
  fi
  echo "  ✅ ${lang}: OK"
  return 0
}

# コメントアウトの検出
check_commented_code() {
  echo "  ├─ コメントアウトされたコードをチェック..."
  
  # 3行以上連続するコメント行を検出
  if find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.cs" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -exec grep -Pzo '(?m)(^\s*//.*\n){3,}' {} \; 2>/dev/null | grep -q .; then
    echo "  ⚠️  連続するコメントアウトが検出されました（要確認）"
    # warningのみ、エラーにはしない
  fi
  echo "  ✅ コメントアウトチェック完了"
  return 0
}

# 未使用のインポート/変数を検出（Linterに依存）
check_unused_code() {
  echo "  ├─ 未使用のコードをチェック..."
  
  # JavaScript/TypeScript
  if [ -f "package.json" ]; then
    if command -v npx &> /dev/null; then
      npx eslint --quiet . || {
        echo "  ❌ ESLint エラーがあります"
        return 1
      }
    fi
  fi
  
  # Python
  if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    if command -v pylint &> /dev/null; then
      pylint --errors-only . || {
        echo "  ❌ Pylint エラーがあります"
        return 1
      }
    fi
  fi
  
  echo "  ✅ 未使用コードチェック完了"
  return 0
}

# TODO/FIXMEコメントの検出
check_todo_comments() {
  echo "  ├─ TODO/FIXMEコメントをチェック..."
  
  local todos=$(grep -rn "TODO\|FIXME" . \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=build \
    --exclude="cleanup.sh" 2>/dev/null || true)
  
  if [ -n "$todos" ]; then
    echo "  ⚠️  TODO/FIXMEコメントが見つかりました:"
    echo "$todos" | head -5
    echo "  ℹ️  対応するか、Issueを作成してください"
    # warningのみ、エラーにはしない
  fi
  echo "  ✅ TODO/FIXMEチェック完了"
  return 0
}

# メイン処理
main() {
  local errors=0
  
  # デバッグコードチェック
  check_debug_code "JavaScript" "console\.log" "src/" || ((errors++))
  check_debug_code "TypeScript" "console\.log" "src/" || ((errors++))
  check_debug_code "Python" "print\(" "." || ((errors++))
  check_debug_code "C#/Unity" "Debug\.Log" "Assets/" || ((errors++))
  
  # その他のチェック
  check_commented_code || ((errors++))
  check_unused_code || ((errors++))
  check_todo_comments || ((errors++))
  
  # 結果判定
  if [ $errors -gt 0 ]; then
    echo ""
    echo "❌ クリーンアップチェック失敗（${errors}件のエラー）"
    echo "   → 検出された問題を修正してください"
    exit 1
  fi
  
  echo ""
  echo "✅ すべてのクリーンアップチェックに合格しました"
  exit 0
}

main "$@"
