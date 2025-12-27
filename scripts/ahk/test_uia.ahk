#Requires AutoHotkey v1.1
#SingleInstance, Force

; UI Automation テスト: Windsurf の "Run Alt+Enter" ボタンを探す

try
{
    ; UI Automation オブジェクト作成
    uia := ComObjCreate("UIAutomationCore.CUIAutomation8")
    
    ; アクティブウィンドウの要素を取得
    WinGet, hwnd, ID, A
    if (hwnd = "")
    {
        MsgBox, アクティブウィンドウが見つかりません
        ExitApp
    }
    
    ; UI Automation 要素に変換
    elem := uia.ElementFromHandle(hwnd)
    if (!elem)
    {
        MsgBox, UI Automation 要素に変換できません
        ExitApp
    }
    
    ; ウィンドウ全体を走査して "Run" を含むボタンを探す
    walker := uia.CreateTreeWalker(uia.CreatePropertyCondition(30003, 50000))  ; Button type
    
    ; 簡易版: 直接ボタンを探す
    condition := uia.CreatePropertyCondition(30005, "Run Alt+Enter")  ; Name property
    buttons := elem.FindAll(2, condition)  ; TreeScope.Descendants
    
    if (buttons.Length > 0)
    {
        MsgBox, % "見つかりました: " buttons.Length " 個のボタン"
        
        ; 最初のボタン情報を表示
        btn := buttons.GetElement(0)
        MsgBox, % "ボタン名: " btn.CurrentName
    }
    else
    {
        MsgBox, "Run Alt+Enter" ボタンが見つかりません
        
        ; デバッグ: 全ボタンを列挙
        condition2 := uia.CreatePropertyCondition(30003, 50000)
        allButtons := elem.FindAll(2, condition2)
        
        output := "見つかったボタン数: " allButtons.Length "`n`n"
        Loop, % allButtons.Length
        {
            btn := allButtons.GetElement(A_Index - 1)
            output .= "Button " A_Index ": " btn.CurrentName "`n"
        }
        
        MsgBox, %output%
    }
}
catch e
{
    MsgBox, % "エラー: " e.What "`n" e.Extra "`n" e.Message
}

ExitApp
