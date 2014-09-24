# Major-release

[Majordomo](https://github.com/nevyk/majordomo) command to help to release new version of your project. Remember that neither npm nor bower won't work without git module because of their philosophy of package releasing (using git tags). Dont't forget to commit all wanted changes before releasing.

## Installation

```bash
$ npm install -g major-release
```

## Usage

```bash
$ majordomo release
```

## Modules

### git

- creates new tag
- pushes local repository to remote one (including tags)

### npm

- publishes package

### bower

- registers component

## License

Major-release is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný ([Twitter](https://twitter.com/pnevyk)).
