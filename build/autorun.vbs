Option Explicit
'On Error Resume Next
Dim Shell, Command_0, Command_1, Command_2, Command_3, Command_4, Command_5, Command_6, Command_7, Command_8, Command_9, Command_10, objRandom, objRandomNumber
Dim Process, Processes, Inst, Inst2, Query, Query2, Processo

'Dim oDW : Set oDW = CreateObject("DynamicWrapper")
'  oDW.Register "USER32.DLL", "ShowCursor", "i=l", "f=s", "r=l"  ' declare
'api
'Call oDW.ShowCursor(CLng(False))  ' hide the system cursor


Command_0 = "C:\Arcade\Startup\nomousy\nomousy.exe /hide"
Command_1 = "C:\Arcade\Startup\MultiRes\MultiRes.exe /400,256,32"
Command_2 = "C:\Arcade\Startup\Frameless\Frameless.exe .\Image1\0000.png caption=Loading1 aob=yes taskbar=no noexit=yes duration=00:00:10 fullscreen=yes"
Command_3 = "C:\Arcade\Emulator\CPWizard\CPWizard.exe -minimized"
Command_4 = "C:\Arcade\Emulator\MAME\mame64.exe mk2"
Command_5 = "C:\Arcade\Startup\Frameless\Frameless.exe .\Image2\Loading.png caption=Loading2 aob=yes taskbar=no noexit=yes duration=00:00:20 fullscreen=yes"
Command_6 = "C:\Arcade\Startup\MultiRes\MultiRes.exe /640,480,32"
Command_7 = "C:\Arcade\Startup\MultiRes\MultiRes.exe /720,480,32"
Command_8 = "C:\Arcade\FE\HyperSpin\HyperSpin.exe"
Command_9 = "C:\Arcade\Startup\nomousy\nomousy.exe /e"
Command_10 = "vlc.exe --video-x 1440 --video-y 900 --qt-fullscreen-screennumber=2 --fullscreen --loop --noaudio --no-video-title-show --no-osd --no-qt-fs-controller  ""C:\Arcade\Startup\Mk2.mp4"""
Set objRandom = CreateObject("System.Random")
Set Processes = GetObject("winmgmts:root\cimv2")
Set Shell = CreateObject("WScript.Shell")
Process = "Frameless.exe"
Shell.CurrentDirectory = "C:\Arcade\Emulator\MAME\"

'Batch Commands
Shell.Run Command_0 'Hide Pointer
'Shell.Run Command_1 'Change Resolution
Shell.Run Command_2, 0, False 'MORTAL KOMBAT II KUSTOM ARCADE MACHINE
'Shell.Run Command_3, 6 'Load CPWizard
Shell.Run Command_4, 0, True 'Load MAME with MK2
Set Query = Processes.ExecQuery("Select * from Win32_Process where Name = """ & Process & """")
If Query.Count > 0 Then 'Closes the first image if it remains opened
	For Each Inst In Query 
		Inst.Terminate()
	Next
End If
Shell.Run Command_5, 0 'NOW LOADING HYPERSPIN...
'Shell.Run Command_6 '640x480
'Shell.Run Command_7 '720x480
Shell.CurrentDirectory = "C:\Program Files\VideoLAN\VLC\"
Shell.Run Command_10, 1, False'Load Mk2 Video
Shell.Run Command_8, 1, True 'Load Hyperspin

objRandomNumber = objRandom.Next_2(1, 100)
'Encerra video aleatóriamente
If (objRandomNumber <= 50) Then
	Set Query2 = Processes.ExecQuery ("Select * from Win32_Process Where Name = ""vlc.exe""")
	If Query2.Count > 0 Then 
		For Each Inst2 In Query2 
			Inst2.Terminate()
		Next
	End If
End If


Shell.Run Command_9 'Show Pointer back

WScript.Quit