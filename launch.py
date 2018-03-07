# a script that allows the user to launch VisualGit through double-clicking/executing
# note that in linux/mac os, you may have to configure this script's access permission to allow double-clicking this script to execute it

from sys import platform
from subprocess import call

# opening the script in linux/mac os machines
if platform.startswith('linux') or platform == "darwin":
	call(["npm", "start"])
# opening the script in windows machines
elif platform == "win32":
	call(["npm", "start"], shell=True)