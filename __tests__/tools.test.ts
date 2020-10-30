import * as tools from '../src/tools';

describe('Tools tests', () => {
  it('checking getCommand', async () => {
    expect(await tools.getCommand('linux', 'tool')).toBe('add_tool ');
    expect(await tools.getCommand('darwin', 'tool')).toBe('add_tool ');
    expect(await tools.getCommand('win32', 'tool')).toBe('Add-Tool ');
    expect(await tools.getCommand('openbsd', 'tool')).toContain(
      'Platform openbsd is not supported'
    );
  });

  it('checking getCommand', async () => {
    expect(await tools.getCommand('linux', 'composertool')).toBe(
      'add_composertool '
    );
    expect(await tools.getCommand('darwin', 'composertool')).toBe(
      'add_composertool '
    );
    expect(await tools.getCommand('win32', 'composertool')).toBe(
      'Add-Composertool '
    );
    expect(await tools.getCommand('openbsd', 'composertool')).toContain(
      'Platform openbsd is not supported'
    );
  });

  it('checking getCommand', async () => {
    expect(await tools.getCommand('linux', 'pecl')).toBe('add_pecl ');
    expect(await tools.getCommand('darwin', 'pecl')).toBe('add_pecl ');
    expect(await tools.getCommand('win32', 'pecl')).toBe('Add-Pecl ');
    expect(await tools.getCommand('openbsd', 'pecl')).toContain(
      'Platform openbsd is not supported'
    );
  });

  it('checking parseToolVersion', async () => {
    expect(await tools.getToolVersion('latest')).toBe('latest');
    expect(await tools.getToolVersion('1.2.3')).toBe('1.2.3');
    expect(await tools.getToolVersion('^1.2.3')).toBe('1.2.3');
    expect(await tools.getToolVersion('>=1.2.3')).toBe('1.2.3');
    expect(await tools.getToolVersion('>1.2.3')).toBe('1.2.3');
    expect(await tools.getToolVersion('1.2.3-ALPHA')).toBe('1.2.3-ALPHA');
    expect(await tools.getToolVersion('1.2.3-alpha')).toBe('1.2.3-alpha');
    expect(await tools.getToolVersion('1.2.3-beta')).toBe('1.2.3-beta');
    expect(await tools.getToolVersion('1.2.3-rc')).toBe('1.2.3-rc');
    expect(await tools.getToolVersion('1.2.3-dev')).toBe('1.2.3-dev');
    expect(await tools.getToolVersion('1.2.3-alpha1')).toBe('1.2.3-alpha1');
    expect(await tools.getToolVersion('1.2.3-alpha.1')).toBe('1.2.3-alpha.1');
  });

  it('checking parseToolVersion', async () => {
    expect(await tools.parseTool('phpunit')).toStrictEqual({
      name: 'phpunit',
      version: 'latest'
    });
    expect(await tools.parseTool('phpunit:1.2.3')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3'
    });
    expect(await tools.parseTool('phpunit:^1.2.3')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3'
    });
    expect(await tools.parseTool('phpunit:>=1.2.3')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3'
    });
    expect(await tools.parseTool('phpunit:>1.2.3')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3'
    });
    expect(await tools.parseTool('phpunit:1.2.3-ALPHA')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-ALPHA'
    });
    expect(await tools.parseTool('phpunit:1.2.3-alpha')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-alpha'
    });
    expect(await tools.parseTool('phpunit:1.2.3-beta')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-beta'
    });
    expect(await tools.parseTool('phpunit:1.2.3-rc')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-rc'
    });
    expect(await tools.parseTool('phpunit:1.2.3-dev')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-dev'
    });
    expect(await tools.parseTool('phpunit:1.2.3-alpha1')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-alpha1'
    });
    expect(await tools.parseTool('phpunit:1.2.3-alpha.1')).toStrictEqual({
      name: 'phpunit',
      version: '1.2.3-alpha.1'
    });
  });

  it('checking getUri', async () => {
    expect(
      await tools.getUri('tool', '.phar', 'latest', 'releases', '', 'download')
    ).toBe('releases/latest/download/tool.phar');
    expect(
      await tools.getUri('tool', '.phar', '1.2.3', 'releases', '', 'download')
    ).toBe('releases/download/1.2.3/tool.phar');
    expect(
      await tools.getUri('tool', '.phar', '1.2.3', 'releases', 'v', 'download')
    ).toBe('releases/download/v1.2.3/tool.phar');
  });

  it('checking getCodeceptionUriBuilder', async () => {
    expect(await tools.getCodeceptionUriBuilder('3.2.1', 'php56')).toBe(
      'releases/3.2.1/php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUriBuilder('3.2.1', 'php54')).toBe(
      'releases/3.2.1/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUriBuilder('3.2.1', '')).toBe(
      'releases/3.2.1/codecept.phar'
    );
  });

  it('checking getCodeceptionUri', async () => {
    expect(await tools.getCodeceptionUri('latest', '5.6')).toBe(
      'php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('latest', '7.0')).toBe(
      'php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('latest', '7.1')).toBe(
      'php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('latest', '7.2')).toBe(
      'codecept.phar'
    );
    expect(await tools.getCodeceptionUri('latest', '7.3')).toBe(
      'codecept.phar'
    );
    expect(await tools.getCodeceptionUri('latest', '7.4')).toBe(
      'codecept.phar'
    );
    expect(await tools.getCodeceptionUri('4.0.0', '7.4')).toBe(
      'releases/4.0.0/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('4.0.0', '5.6')).toBe(
      'releases/4.0.0/php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('4.0.0', '7.1')).toBe(
      'releases/4.0.0/php56/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('3.1.0', '7.4')).toBe(
      'releases/3.1.0/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('3.1.0', '5.6')).toBe(
      'releases/3.1.0/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.5.4', '7.4')).toBe(
      'releases/2.5.4/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.5.4', '5.6')).toBe(
      'releases/2.5.4/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.3.4', '7.4')).toBe(
      'releases/2.3.4/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.3.4', '5.4')).toBe(
      'releases/2.3.4/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.2.4', '5.6')).toBe(
      'releases/2.2.4/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.2.4', '7.4')).toBe(
      'releases/2.2.4/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.2.4', '5.4')).toBe(
      'releases/2.2.4/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.1.7', '5.6')).toBe(
      'releases/2.1.7/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.1.7', '5.4')).toBe(
      'releases/2.1.7/php54/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.1.5', '5.4')).toBe(
      'releases/2.1.5/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('2.1.5', '7.4')).toBe(
      'releases/2.1.5/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('1.6.9', '7.4')).toBe(
      'releases/1.6.9/codecept.phar'
    );
    expect(await tools.getCodeceptionUri('1.5.0', '7.4')).toBe(
      'releases/1.5.0/codecept.phar'
    );
  });

  it('checking addPhive', async () => {
    let script: string = await tools.addPhive('1.2.3', 'linux');
    expect(script).toContain(
      'add_tool https://github.com/phar-io/phive/releases/download/1.2.3/phive-1.2.3.phar phive'
    );

    script = await tools.addPhive('latest', 'win32');
    expect(script).toContain(
      'Add-Tool https://phar.io/releases/phive.phar phive'
    );
  });

  it('checking getPhpunitUri', async () => {
    expect(await tools.getPharUrl('domain', 'tool', '', 'latest')).toBe(
      'domain/tool.phar'
    );
    expect(await tools.getPharUrl('domain', 'tool', 'v', '1.2.3')).toBe(
      'domain/tool-v1.2.3.phar'
    );
  });

  it('checking getDeployerUri', async () => {
    expect(await tools.getDeployerUrl('latest')).toBe(
      'https://deployer.org/deployer.phar'
    );
    expect(await tools.getDeployerUrl('1.2.3')).toBe(
      'https://deployer.org/releases/v1.2.3/deployer.phar'
    );
  });

  it('checking addComposer', async () => {
    expect(await tools.addComposer(['a', 'b'])).toStrictEqual([
      'composer',
      'a',
      'b'
    ]);
    expect(await tools.addComposer(['a', 'b', 'composer'])).toStrictEqual([
      'composer',
      'a',
      'b'
    ]);
    expect(
      await tools.addComposer(['a', 'b', 'composer:1.2.3'])
    ).toStrictEqual(['composer', 'a', 'b']);
    expect(
      await tools.addComposer(['a', 'b', 'composer:snapshot'])
    ).toStrictEqual(['composer:snapshot', 'a', 'b']);
    expect(
      await tools.addComposer(['a', 'b', 'composer:preview'])
    ).toStrictEqual(['composer:preview', 'a', 'b']);
    expect(
      await tools.addComposer(['a', 'b', 'c', 'composer:1'])
    ).toStrictEqual(['composer:1', 'a', 'b', 'c']);
    expect(
      await tools.addComposer(['a', 'b', 'c', 'composer:2'])
    ).toStrictEqual(['composer:2', 'a', 'b', 'c']);
    expect(
      await tools.addComposer(['a', 'b', 'c', 'composer:v1'])
    ).toStrictEqual(['composer:1', 'a', 'b', 'c']);
    expect(
      await tools.addComposer(['a', 'b', 'c', 'composer:v2'])
    ).toStrictEqual(['composer:2', 'a', 'b', 'c']);
    expect(
      await tools.addComposer(['hirak', 'b', 'c', 'composer:v2'])
    ).toStrictEqual(['composer:1', 'hirak', 'b', 'c']);
  });

  it('checking getComposerUrl', async () => {
    expect(await tools.getComposerUrl('latest')).toContain(
      'https://getcomposer.org/composer-stable.phar'
    );
    expect(await tools.getComposerUrl('stable')).toContain(
      'https://getcomposer.org/composer-stable.phar'
    );
    expect(await tools.getComposerUrl('snapshot')).toContain(
      'https://getcomposer.org/composer.phar'
    );
    expect(await tools.getComposerUrl('preview')).toContain(
      'https://getcomposer.org/composer-preview.phar'
    );
    expect(await tools.getComposerUrl('1')).toContain(
      'https://getcomposer.org/composer-1.phar'
    );
    expect(await tools.getComposerUrl('2')).toContain(
      'https://getcomposer.org/composer-2.phar'
    );
    expect(await tools.getComposerUrl('1.7.2')).toContain(
      'https://github.com/composer/composer/releases/download/1.7.2/composer.phar'
    );
    expect(await tools.getComposerUrl('2.0.0-RC2')).toContain(
      'https://github.com/composer/composer/releases/download/2.0.0-RC2/composer.phar'
    );
    expect(await tools.getComposerUrl('wrong')).toContain(
      'https://getcomposer.org/composer-stable.phar'
    );
  });

  it('checking getSymfonyUri', async () => {
    expect(await tools.getSymfonyUri('latest', 'linux')).toContain(
      'releases/latest/download/symfony_linux_amd64'
    );
    expect(await tools.getSymfonyUri('1.2.3', 'linux')).toContain(
      'releases/download/v1.2.3/symfony_linux_amd64'
    );
    expect(await tools.getSymfonyUri('latest', 'darwin')).toContain(
      'releases/latest/download/symfony_darwin_amd64'
    );
    expect(await tools.getSymfonyUri('1.2.3', 'darwin')).toContain(
      'releases/download/v1.2.3/symfony_darwin_amd64'
    );
    expect(await tools.getSymfonyUri('latest', 'win32')).toContain(
      'releases/latest/download/symfony_windows_amd64'
    );
    expect(await tools.getSymfonyUri('1.2.3', 'win32')).toContain(
      'releases/download/v1.2.3/symfony_windows_amd64'
    );
    expect(await tools.getSymfonyUri('1.2.3', 'openbsd')).toContain(
      'Platform openbsd is not supported'
    );
  });

  it('checking getCleanedToolsList', async () => {
    const tools_list: string[] = await tools.getCleanedToolsList(
      'tool, composer:1.2.3, robmorgan/phinx'
    );
    expect(tools_list).toStrictEqual(['composer', 'tool', 'phinx']);
  });

  it('checking addArchive', async () => {
    let script: string = await tools.addArchive(
      'tool',
      'https://tool.com/tool.phar',
      'linux'
    );
    expect(script).toContain('add_tool https://tool.com/tool.phar tool');
    script = await tools.addArchive(
      'tool',
      'https://tool.com/tool.phar',
      'darwin'
    );
    expect(script).toContain('add_tool https://tool.com/tool.phar tool');
    script = await tools.addArchive(
      'tool',
      'https://tool.com/tool.phar',
      'win32'
    );
    expect(script).toContain('Add-Tool https://tool.com/tool.phar tool');

    script = await tools.addArchive(
      'tool',
      'https://tool.com/tool.phar',
      'openbsd'
    );
    expect(script).toContain('Platform openbsd is not supported');
  });

  it('checking addDevTools', async () => {
    let script: string = await tools.addDevTools('phpize', 'linux');
    expect(script).toContain('add_devtools');
    expect(script).toContain('add_log "$tick" "phpize" "Added"');

    script = await tools.addDevTools('php-config', 'linux');
    expect(script).toContain('add_devtools');
    expect(script).toContain('add_log "$tick" "php-config" "Added"');

    script = await tools.addDevTools('phpize', 'darwin');
    expect(script).toContain('add_log "$tick" "phpize" "Added"');

    script = await tools.addDevTools('php-config', 'darwin');
    expect(script).toContain('add_log "$tick" "php-config" "Added"');

    script = await tools.addDevTools('phpize', 'win32');
    expect(script).toContain(
      'Add-Log "$cross" "phpize" "phpize is not a windows tool"'
    );

    script = await tools.addDevTools('php-config', 'win32');
    expect(script).toContain(
      'Add-Log "$cross" "php-config" "php-config is not a windows tool"'
    );

    script = await tools.addDevTools('tool', 'openbsd');
    expect(script).toContain('Platform openbsd is not supported');
  });

  it('checking addPackage', async () => {
    let script: string = await tools.addPackage(
      'tool',
      'tool:1.2.3',
      'user/',
      'linux'
    );
    expect(script).toContain('add_composertool tool tool:1.2.3 user/');

    script = await tools.addPackage('tool', 'tool:1.2.3', 'user/', 'darwin');
    expect(script).toContain('add_composertool tool tool:1.2.3 user/');

    script = await tools.addPackage('tool', 'tool:1.2.3', 'user/', 'win32');
    expect(script).toContain('Add-Composertool tool tool:1.2.3 user/');

    script = await tools.addPackage('tool', 'tool:1.2.3', 'user/', 'openbsd');
    expect(script).toContain('Platform openbsd is not supported');
  });

  it('checking addTools on linux', async () => {
    const script: string = await tools.addTools(
      'cs2pr, php-cs-fixer, phpstan, phpunit, pecl, phinx, phinx:1.2.3, phive, php-config, phpize, symfony',
      '7.4',
      'linux'
    );
    expect(script).toContain(
      'add_tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-stable.phar,https://getcomposer.org/composer-stable.phar composer'
    );
    expect(script).toContain(
      'add_tool https://github.com/staabm/annotate-pull-request-from-checkstyle/releases/latest/download/cs2pr cs2pr'
    );
    expect(script).toContain(
      'add_tool https://github.com/FriendsOfPHP/PHP-CS-Fixer/releases/latest/download/php-cs-fixer.phar php-cs-fixer'
    );
    expect(script).toContain(
      'add_tool https://github.com/phpstan/phpstan/releases/latest/download/phpstan.phar phpstan'
    );
    expect(script).toContain(
      'add_tool https://phar.io/releases/phive.phar phive'
    );
    expect(script).toContain(
      'add_tool https://phar.phpunit.de/phpunit.phar phpunit'
    );
    expect(script).toContain(
      'add_tool https://github.com/symfony/cli/releases/latest/download/symfony_linux_amd64 symfony'
    );
    expect(script).toContain('add_pecl');
    expect(script).toContain('add_composertool phinx phinx robmorgan/');
    expect(script).toContain('add_composertool phinx phinx:1.2.3 robmorgan/');
    expect(script).toContain('add_devtools');
    expect(script).toContain('add_log "$tick" "php-config" "Added"');
    expect(script).toContain('add_log "$tick" "phpize" "Added"');
  });
  it('checking addTools on darwin', async () => {
    const script: string = await tools.addTools(
      'phpcs, phpcbf, phpcpd, phpmd, psalm, phinx, phive:1.2.3, cs2pr:1.2.3, phpize, php-config, symfony:1.2.3',
      '7.4',
      'darwin'
    );
    expect(script).toContain(
      'add_tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-stable.phar,https://getcomposer.org/composer-stable.phar composer'
    );
    expect(script).toContain(
      'add_tool https://github.com/staabm/annotate-pull-request-from-checkstyle/releases/download/1.2.3/cs2pr cs2pr'
    );
    expect(script).toContain(
      'add_tool https://github.com/squizlabs/PHP_CodeSniffer/releases/latest/download/phpcs.phar phpcs'
    );
    expect(script).toContain(
      'add_tool https://github.com/squizlabs/PHP_CodeSniffer/releases/latest/download/phpcbf.phar phpcbf'
    );
    expect(script).toContain(
      'add_tool https://phar.phpunit.de/phpcpd.phar phpcpd'
    );
    expect(script).toContain(
      'add_tool https://github.com/phpmd/phpmd/releases/latest/download/phpmd.phar phpmd'
    );
    expect(script).toContain(
      'https://github.com/vimeo/psalm/releases/latest/download/psalm.phar psalm'
    );
    expect(script).toContain('add_composertool phinx phinx robmorgan/');
    expect(script).toContain(
      'add_tool https://github.com/phar-io/phive/releases/download/1.2.3/phive-1.2.3.phar phive'
    );
    expect(script).toContain(
      'add_tool https://github.com/symfony/cli/releases/download/v1.2.3/symfony_darwin_amd64 symfony'
    );
    expect(script).toContain('add_log "$tick" "phpize" "Added"');
    expect(script).toContain('add_log "$tick" "php-config" "Added"');
  });
  it('checking addTools on windows', async () => {
    const script: string = await tools.addTools(
      'codeception, cs2pr, deployer, phpmd, phinx, phive:0.13.2, php-config, phpize, symfony, does_not_exist, composer',
      '7.4',
      'win32'
    );
    expect(script).toContain(
      'Add-Tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-stable.phar,https://getcomposer.org/composer-stable.phar composer'
    );
    expect(script).toContain(
      'Add-Tool https://github.com/staabm/annotate-pull-request-from-checkstyle/releases/latest/download/cs2pr cs2pr'
    );
    expect(script).toContain(
      'Add-Tool https://deployer.org/deployer.phar deployer'
    );
    expect(script).toContain(
      'Add-Tool https://github.com/phpmd/phpmd/releases/latest/download/phpmd.phar phpmd'
    );
    expect(script).toContain('Add-Composertool phinx phinx robmorgan/');
    expect(script).toContain(
      'Add-Tool https://github.com/phar-io/phive/releases/download/0.13.2/phive-0.13.2.phar phive'
    );
    expect(script).toContain(
      'Add-Tool https://github.com/symfony/cli/releases/latest/download/symfony_windows_amd64.exe symfony'
    );
    expect(script).toContain('phpize is not a windows tool');
    expect(script).toContain('php-config is not a windows tool');
    expect(script).toContain('Tool does_not_exist is not supported');
  });
  it('checking addTools with composer tool using user/tool as input', async () => {
    const script: string = await tools.addTools(
      'hirak/prestissimo, narrowspark/automatic-composer-prefetcher, robmorgan/phinx',
      '7.4',
      'win32'
    );
    expect(script).toContain(
      'Add-Tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-1.phar,https://getcomposer.org/composer-1.phar composer'
    );
    expect(script).toContain('Add-Composertool prestissimo prestissimo hirak/');
    expect(script).toContain('Add-Composertool phinx phinx robmorgan/');
    expect(script).toContain(
      'Add-Composertool composer-prefetcher composer-prefetcher narrowspark/automatic-'
    );
  });
  it('checking composer setup', async () => {
    let script: string = await tools.addTools(
      'composer, composer:v1',
      '7.4',
      'linux'
    );
    expect(script).toContain(
      'add_tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-1.phar,https://getcomposer.org/composer-1.phar composer'
    );

    script = await tools.addTools('composer:preview', '7.4', 'linux');
    expect(script).toContain(
      'add_tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-preview.phar,https://getcomposer.org/composer-preview.phar composer'
    );
    script = await tools.addTools(
      'composer:v1, composer:preview, composer:snapshot',
      '7.4',
      'linux'
    );
    expect(script).toContain(
      'add_tool https://github.com/shivammathur/composer-cache/releases/latest/download/composer-snapshot.phar,https://getcomposer.org/composer.phar composer'
    );
  });
});
