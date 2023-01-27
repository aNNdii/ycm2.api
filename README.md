# YCM2
An open source api for managing Metin2 game servers, written in Node.js and using GraphQL.

## Features
- Easy configuration
- Obfuscation of sensitive data (YouTube-like)
- Account management
- Character management
- Item management
- Mob management
- Mob Group Management
- Mob Group Group Management
- Map Management
- Multi-language support
- Access Control and Permissions Management
- Performance & Caching
- Offset pagination
- Support for game modification (import & export) of the following files 
  - item_proto
  - item_names.txt
  - item_description.txt
  - item_lists.txt
  - mob_proto
  - mob_names.txt
  - mob_drop_item.txt
  - common_drop_item.txt
  - mob_group.txt
  - mob_group_group.txt
  - Map (Index, Settings.txt)


## Deployment
This API requires Node.JS and npm to be installed on your server.

1. Clone the repository
```bash
  git clone https://github.com/aNNdii/ycm2.api.git
```

2. Install dependencies
```bash
  npm install
```

3. Build
```bash
  npm run build
```


4. Start the server
```bash
  npm start
```

5. Access it by making GraphQL queries to the endpoint ``http://localhost:4000/graphql``.


## Examples
```graphql

# Get first page of accounts with characters
query {
  accounts {
    id
    username
    characters {
      id
      name
      level
      sex
      empire
      race
    }
  }
}

# Return item by id with its locales & drop sources
query {
  item(id: "290") {
    id
    name
    locales {
      name
      locale {
        code
      }
    }
    source {
      mob
        mob {
          id
          name
        }
      }
    }
  }
}
```


## Roadmap
- Analytics
- Vote 4 Coins
- Item Shop
- Support for more game files such as
  - special_item_group.txt
  - cube.txt
  - blend.txt
  - Map (regen.txt, boss.txt, stone.txt...)
- And many, many more...


## Contributing
I'm still in the early stages of development and am looking for contributions from server owners to help improve and develop new features. If you are interested in contributing, have some feedback or would like to suggest a new feature, please feel free to contact me.


## Support
For support, send me a message on Discord ``aNNdii#3846``.