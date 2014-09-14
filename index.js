var majordomo = require('majordomo');

module.exports = function (config) {
    var command = majordomo('release', config);
    
    if (command.has('git')) {
        //We really need asynchronous operations support in Majordomo!
        getCurrentBranch(function (branch) {
            command
                .ask('input', 'remote', 'Which remote you want to release to?', 'origin')
                .ask('input', 'branch', 'Which branch you want to release?', branch);
                
            rest();
        });
    }
    
    else {
        rest();
    }
        
    function rest() {
        command
            .ask('input', 'version', 'What version will be this release?', getNewVersion())
            .ask('input', 'message', 'Describe this release')
            .run(function () {
                upgradeVersion(this.get('version'));
                
                if (this.has('git')) {
                    majordomo.exec('git tag -a v' + this.get('version') + ' -m "' + this.get('message') + '"');
                    majordomo.exec('git push -u --tags ' + this.get('remote') + ' ' + this.get('branch'));
                }
                
                if (this.has('npm')) {
                    majordomo.exec('npm publish');
                }
                
                if (this.has('bower')) {
                    majordomo.exec('bower register');
                }
            });
    }
};

function getNewVersion() {
    var match, pattern = /\"version\"\:\s*\"([^\"]*)\"/;
    
    if (majordomo.dest.exists('package.json')) {
        match = majordomo.dest.read('package.json').match(pattern);
    }
    
    else if (majordomo.dest.exists('bower.json')) {
        match = majordomo.dest.read('bower.json').match(pattern);
    }
    
    var version = match ? match[1] : '0.1.0';
    var last = +version.match(/\.(\d+)$/)[1];
    
    return version.replace(/\d+$/, ++last);
}

function upgradeVersion(version) {
    var content, propPattern = /\"version\"\:\s*\"[^\"]*\"/, verPattern = /(\d+\.\d+\.\d+)/;
    
    if (majordomo.dest.exists('package.json')) {
        content = majordomo.dest.read('package.json');
        content = content.replace(propPattern, function (match) {
            return match.replace(verPattern, version);
        });
        
        majordomo.dest.write('package.json', content);
    }
    
    if (majordomo.dest.exists('bower.json')) {
        content = majordomo.dest.read('bower.json');
        content = content.replace(propPattern, function (match) {
            return match.replace(verPattern, version);
        });
        
        majordomo.dest.write('bower.json', content);
    }
}

function getCurrentBranch(cb) {
    majordomo.exec('git branch', function (err, output) {
        if (!output) cb('master');
        else cb(output.match(/\*\s(.+)/)[1]);
    });
}