# Overviews
- NodeJS Sever use JWT to authenticate user requests
- Using Dummy Data
- Features:
  - Login
  - Access Token
    - Set Expire time
    - Re-generate
  - Refresh Token
    - Set Expire time
    - Re-generate
    - Remove
  - Logout
  - Get Posts
## Steps:
- npm init
- npm i express jsonwebtoken dotenv
- npm i nodemon --save-dev
### lib
  - dotenv: 
    - used to store secret (password)
    - stored into environment variable file
  - nodemon: 
    - automatically restart server when have change in code
### Extensions:
  - REST Client: allow use HTTP requests inside VScode
  - Create 'request.http' file to try with HTTP requests