# Function to setup environment for self-hosted runners.
self_hosted_helper() {
  if ! command -v brew >/dev/null; then
    step_log "Setup Brew"
    get -q -e "/tmp/install.sh" "https://raw.githubusercontent.com/Homebrew/install/master/install.sh" && /tmp/install.sh >/dev/null 2>&1
    add_log "${tick:?}" "Brew" "Installed Homebrew"
  fi
}

# Function to remove extensions.
remove_extension() {
  extension=$1
  if check_extension "$extension"; then
    sudo sed -Ei '' "/=(.*\/)?\"?$extension/d" "${ini_file:?}"
    sudo rm -rf "${scan_dir:?}"/*"$extension"* "${ext_dir:?}"/"$extension".so >/dev/null 2>&1
    (! check_extension "$extension" && add_log "${tick:?}" ":$extension" "Removed") ||
      add_log "${cross:?}" ":$extension" "Could not remove $extension on PHP ${semver:?}"
  else
    add_log "${tick:?}" ":$extension" "Could not find $extension on PHP $semver"
  fi
}

# Function to install a specific version of PECL extension.
add_pecl_extension() {
  extension=$1
  pecl_version=$2
  prefix=$3
  enable_extension "$extension" "$prefix"
  if [[ $pecl_version =~ .*(alpha|beta|rc|snapshot|preview).* ]]; then
    pecl_version=$(get_pecl_version "$extension" "$pecl_version")
  fi
  ext_version=$(php -r "echo phpversion('$extension');")
  if [ "$ext_version" = "$pecl_version" ]; then
    add_log "${tick:?}" "$extension" "Enabled"
  else
    remove_extension "$extension" >/dev/null 2>&1
    pecl_install "$extension-$pecl_version"
    add_extension_log "$extension-$pecl_version" "Installed and enabled"
  fi
}

# Function to fetch a brew tap
fetch_brew_tap() {
  tap=$1
  tap_user=$(dirname "$tap")
  tap_name=$(basename "$tap")
  mkdir -p "$tap_dir/$tap_user"
  get -s -n "" "https://github.com/$tap/archive/master.tar.gz" | sudo tar -xzf - -C "$tap_dir/$tap_user"
  if [ -d "$tap_dir/$tap_user/$tap_name-master" ]; then
    sudo mv "$tap_dir/$tap_user/$tap_name-master" "$tap_dir/$tap_user/$tap_name"
  fi
}

# Function to add a brew tap.
add_brew_tap() {
  tap=$1
  if ! [ -d "$tap_dir/$tap" ]; then
    if [ "${runner:?}" = "self-hosted" ]; then
      brew tap --shallow "$tap" >/dev/null 2>&1
    else
      fetch_brew_tap "$tap" >/dev/null 2>&1
      if ! [ -d "$tap_dir/$tap" ]; then
        brew tap --shallow "$tap" >/dev/null 2>&1
      fi
    fi
  fi
}

# Function to install a php extension from shivammathur/extensions tap.
add_brew_extension() {
  formula=$1
  prefix=$2
  extension=${formula//[0-9]/}
  enable_extension "$extension" "$prefix"
  if check_extension "$extension"; then
    add_log "${tick:?}" "$extension" "Enabled"
  else
    add_brew_tap shivammathur/homebrew-php
    add_brew_tap shivammathur/homebrew-extensions
    sudo mv "$tap_dir"/shivammathur/homebrew-extensions/.github/deps/"$extension"/* "$tap_dir/homebrew/homebrew-core/Formula/" 2>/dev/null || true
    brew install "$formula@$version" >/dev/null 2>&1
    sudo cp "$brew_prefix/opt/$formula@$version/$extension.so" "$ext_dir"
    add_extension_log "$extension" "Installed and enabled"
  fi
}

# Function to setup extensions
add_extension() {
  extension=$1
  prefix=$2
  enable_extension "$extension" "$prefix"
  if check_extension "$extension"; then
    add_log "${tick:?}" "$extension" "Enabled"
  else
    [[ "$version" =~ 5.[4-5] ]] && [ "$extension" = "imagick" ] && brew install pkg-config imagemagick >/dev/null 2>&1
    pecl_install "$extension" >/dev/null 2>&1 &&
      if [[ "$version" =~ ${old_versions:?} ]]; then echo "$prefix=$ext_dir/$extension.so" >>"$ini_file"; fi
    add_extension_log "$extension" "Installed and enabled"
  fi
}

# Function to handle request to add phpize and php-config.
add_devtools() {
  tool=$1
  add_log "${tick:?}" "$tool" "Added $tool $semver"
}

# Function to handle request to add PECL.
add_pecl() {
  pecl_version=$(get_tool_version "pecl" "version")
  add_log "${tick:?}" "PECL" "Found PECL $pecl_version"
}

# Function to update dependencies.
update_dependencies() {
  if [[ "$version" =~ ${nightly_versions:?} ]] && [ "${runner:?}" != "self-hosted" ] && [ "${ImageOS:-}" != "" ] && [ "${ImageVersion:-}" != "" ]; then
    while read -r formula; do
      get -q -n "$tap_dir/homebrew/homebrew-core/Formula/$formula.rb" "https://raw.githubusercontent.com/Homebrew/homebrew-core/master/Formula/$formula.rb" &
      to_wait+=($!)
    done <"$tap_dir/shivammathur/homebrew-php/.github/deps/${ImageOS:?}_${ImageVersion:?}"
    wait "${to_wait[@]}"
  fi
  # Remove once commit with bottle syntax breaking change is in images
  git -C "$brew_repo" pull origin master
}

# Function to setup PHP 5.6 and newer using Homebrew.
add_php() {
  action=$1
  add_brew_tap shivammathur/homebrew-php
  update_dependencies
  if ! [[ "$(find "$(brew --cellar)"/php/ -maxdepth 1 -name "$version*" | wc -l 2>/dev/null)" -eq 0 ]] && [ "$action" != "upgrade" ]; then
    brew unlink shivammathur/php/php@"$version"
  else
    brew upgrade "shivammathur/php/php@$version" 2>/dev/null || brew install "shivammathur/php/php@$version"
  fi
  brew link --force --overwrite shivammathur/php/php@"$version"
}

# Function to Setup PHP
setup_php() {
  step_log "Setup PHP"
  existing_version=$(php-config --version 2>/dev/null | cut -c 1-3)
  if [[ "$version" =~ ${old_versions:?} ]]; then
    run_script "php5-darwin" "${version/./}" >/dev/null 2>&1
    status="Installed"
  elif [ "$existing_version" != "$version" ]; then
    add_php "install" >/dev/null 2>&1
    status="Installed"
  elif [ "$existing_version" = "$version" ] && [ "${update:?}" = "true" ]; then
    add_php "upgrade" >/dev/null 2>&1
    status="Updated to"
  else
    status="Found"
  fi
  ini_file=$(php -d "date.timezone=UTC" --ini | grep "Loaded Configuration" | sed -e "s|.*:s*||" | sed "s/ //g")
  sudo chmod 777 "$ini_file" "${tool_path_dir:?}"
  configure_php
  ext_dir=$(php -i | grep -Ei "extension_dir => /" | sed -e "s|.*=> s*||")
  scan_dir=$(php --ini | grep additional | sed -e "s|.*: s*||")
  sudo mkdir -m 777 -p "$ext_dir" "$HOME/.composer"
  semver=$(php -v | head -n 1 | cut -f 2 -d ' ')
  if [ "${semver%.*}" != "$version" ]; then
    add_log "$cross" "PHP" "Could not setup PHP $version"
    exit 1
  fi
  sudo cp "$dist"/../src/configs/*.json "$RUNNER_TOOL_CACHE/"
  add_log "$tick" "PHP" "$status PHP $semver"
}

# Variables
version=$1
dist=$2
brew_prefix="$(brew --prefix)"
brew_repo="$(brew --repository)"
tap_dir="$brew_repo"/Library/Taps
export HOMEBREW_CHANGE_ARCH_TO_ARM=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
export HOMEBREW_NO_AUTO_UPDATE=1

# shellcheck source=.
. "${dist}"/../src/scripts/common.sh
read_env
self_hosted_setup
setup_php
