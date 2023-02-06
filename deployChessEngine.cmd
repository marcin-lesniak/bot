cls^
 && del /S /Q .\docs^
 && cd my-app^
 && ng build --base-href=/bot/^
 && cd ..^
 && xcopy /s .\my-app\docs .\docs^
 && git add .^
 && git commit -m "deploy"^
 && git push