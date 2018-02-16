## `kickoff-graphql-server`

> A very lean boilerplate for setting up GraphQL server.

#### Requirements
```bash
- Node >=v7.7.2
- NPM >=v4.1.2
- MongoDB
```

### Setup
```bash
  # clone the repository
  λ git clone https://github.com/perminder-klair/kickoff-graqhql-server
  # change the current directory
  λ cd kickoff-graqhql-server
  # install all dependencies
  λ yarn install
  # run the project
  λ yarn start
```

### Structure
```bash
├── README.md           # you're here
├── src                 # contains source files
│   ├── config.js       # wraps configurations files
│   ├── database.js     # contains all mongodb database
│   ├── resolver.js     # contains all resolver from Graphql
│   ├── schema.graphql  # contains graphql schem
└── └── web.js          # start point of server
```

### Scripts

- `yarn start` - simply starts the server
- `yarn develop` -  starts the server with reloading
- `yarn run lint` - lints all the files in `src/` folder
