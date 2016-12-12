curl -k -i "https://dsdev.lan:8080/json/system/version"
curl -k -i "https://dsdev.lan:8080/json/system/time"
curl -k -i "https://dsdev.lan:8080/json/system/getDSID"
curl -k -i "https://dsdev.lan:8080/json/system/login?user=dssadmin&password=dssadmin"
curl -k -i "https://dsdev.lan:8080/json/system/logout"                                        # ??? session token can still be used
curl -k -i "https://dsdev.lan:8080/json/system/loggedInUser"                                  # ??? doesn't work, no user can be found after user logged in
curl -k -i "https://dsdev.lan:8080/json/system/setPassword?password=[newpass]&token=bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d" # ??? wtf {"ok":false,"message":"Write access denied for user dssadmin"}
curl -k -i "https://dsdev.lan:8080/json/system/requestApplicationToken?applicationName=[appName]"
curl -k -i "https://dsdev.lan:8080/json/system/enableToken?applicationToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0&token=bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d"
curl -k -i "https://dsdev.lan:8080/json/system/revokeToken?applicationToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0&token=bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d"
curl -k -i "https://dsdev.lan:8080/json/system/loginApplication?loginToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0"

=======

Create Application Token
curl -k -i "https://dsdev.lan:8080/json/system/requestApplicationToken?applicationName=dev-home-assistant"
result.applicationToken = e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0

Get Session Token (by Logging In)
curl -k -i "https://dsdev.lan:8080/json/system/login?user=dssadmin&password=smartadmin"
result.token bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d

Approve Application Token using Session Token
curl -k -i "https://dsdev.lan:8080/json/system/enableToken?applicationToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0&token=bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d"

=======

Get Session Token using Application Token
curl -k -i "https://dsdev.lan:8080/json/system/loginApplication?loginToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0"
result.token 04f1e7b841e3695006788c7e23b53059f9cdd2559a3d2361abcbb625a2be20ad
* token valid for 60 seconds, prolonged everytime used

=======

OFFICE
https://dsdev.lan:8080/json/system/loginApplication?loginToken=9b8aec5be3c659cbaa985fd714fe6a1db346c4a4163aba717f657a84fb842169
https://dsdev.lan:8080/json/apartment/getStructure?token=2369a63db75ede98e94a84e505876fdf6856c49dd3d06bfe79de0c526b5afd18
https://dsdev.lan:8080/json/apartment/getDevices?token=2369a63db75ede98e94a84e505876fdf6856c49dd3d06bfe79de0c526b5afd18
https://dsdev.lan:8080/json/apartment/getCircuits?token=2369a63db75ede98e94a84e505876fdf6856c49dd3d06bfe79de0c526b5afd18
https://dsdev.lan:8080/json/apartment/getName?token=2369a63db75ede98e94a84e505876fdf6856c49dd3d06bfe79de0c526b5afd18

SHOWROOM
Acquiring Application Token
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/system/requestApplicationToken?applicationName=zynick
36bcca29f1664c040d07c3a0cfd15c974adb30167fb10e54974b9876fa72febc
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/system/login?user=dssadmin&password=smartadmin
435ad66fb9b9d1b4d7469ffcb0883462cda38b53714bd789df87b81814f9c4fe
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/system/enableToken?applicationToken=e0ad6da9aa1cb79337d6b88eb8555706f4785b8dbc61ca0e4ef39b7270a300f0&token=bd07f4a64ae981efc33ae723602ed620b4c8b92269a85cd58d08d9394b75949d

Acquiring Session Token
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/system/loginApplication?loginToken=36bcca29f1664c040d07c3a0cfd15c974adb30167fb10e54974b9876fa72febc
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/apartment/getStructure?token=
https://58f117548b894aafa2ff5437fc50ad4e.digitalstrom.net:8080/json/apartment/getDevices?token=
