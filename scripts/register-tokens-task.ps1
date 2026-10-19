# Registra la tarea "alpefe-tokens": cada 2 horas actualiza el bloque de
# tokens de la portada (scripts/update-tokens.mjs --push) y lo empuja si cambió.
# Los datos viven en los registros locales de HanniPI, así que debe correr en
# esta máquina, no en la nube. Ejecutar una vez:  powershell -File scripts\register-tokens-task.ps1
$repo = 'C:\Users\alexlocal\Documents\AlPeFe.github.io'
$action = New-ScheduledTaskAction -Execute 'cmd.exe' `
  -Argument "/c cd /d $repo && node scripts\update-tokens.mjs --push >> `"%TEMP%\alpefe-tokens.log`" 2>&1" `
  -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2)
Register-ScheduledTask -TaskName 'alpefe-tokens' -Action $action -Trigger $trigger `
  -Description 'Actualiza los tokens (opencode-go / hermes) de alpefe.me desde los registros locales de HanniPI' `
  -Force | Out-Null
Write-Output 'tarea alpefe-tokens registrada: cada 2 horas'
