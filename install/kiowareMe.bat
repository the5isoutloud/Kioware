@echo off

REM Step 1: Use winget to install git
echo Installing Git...
winget install --id Git.Git -e --source winget

REM Step 2: Pull a public git repository and store it in the C:\Share\ folder
echo Cloning Git repository...
IF NOT EXIST "C:\Share" (
    mkdir C:\Share
)
cd C:\Share
git clone https://github.com/the5isoutloud/Kioware.git

REM Step 3: Copy a file from a UNC path and run the executable
echo Copying file from UNC path...
xcopy /E /I /Y \\172.16.150.50\Share\Kioware\install\KioWareClientSetup.exe .

echo Running the executable...
start C:\Share\KioWareClientSetup.exe

echo Done.
pause