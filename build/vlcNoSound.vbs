Option Explicit
'On Error Resume Next
Dim Shell, Command_10

Command_10 = "vlc.exe --video-x 1440 --video-y 900 --qt-fullscreen-screennumber=2  --fullscreen --loop --no-video-title-show --noaudio --no-osd --no-qt-fs-controller  ""C:\Arcade\Startup\Mk2.mp4"""
Set Shell = CreateObject("WScript.Shell")
Shell.CurrentDirectory = "C:\Program Files\VideoLAN\VLC\"
Shell.Run Command_10, 1, False'
WScript.Quit