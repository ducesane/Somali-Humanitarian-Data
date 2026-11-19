# PowerShell Script to register recurring daily automated update task in Windows Task Scheduler
$taskName = "Somalia_Humanitarian_Data_AutoSync"
$workingDir = "c:\Users\KCT\Desktop\Human Data"
$pythonExe = "python.exe"
$scriptPath = "$workingDir\automated_pipeline.py"
$arguments = "`"$scriptPath`" --sync"

Write-Host "Registering Scheduled Task: $taskName..." -ForegroundColor Cyan

try {
    $action = New-ScheduledTaskAction -Execute $pythonExe -Argument $arguments -WorkingDirectory $workingDir
    # Set to trigger daily at 08:00 AM
    $trigger = New-ScheduledTaskTrigger -Daily -At "08:00 AM"
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Daily automated sync pipeline checking UN OCHA HDX 3W and FTS funding releases for Somalia" -Force
    
    Write-Host "SUCCESS: Task '$taskName' has been registered successfully!" -ForegroundColor Green
    Write-Host "The pipeline will automatically run every day at 08:00 AM in the background." -ForegroundColor Green
} catch {
    Write-Host "Notice: Standard user permissions detected. To register as system task, run PowerShell as Administrator, or simply double-click 'run_pipeline.bat' anytime." -ForegroundColor Yellow
}
