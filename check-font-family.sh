#!/bin/bash

echo "=== Font Family Definitions ==="
echo ""

cd "$(dirname "$0")"

node -e "
const defaultTheme = require('tailwindcss/defaultTheme');
const config = require('./tailwind.config.js');
const customFontFamily = config.theme.extend.fontFamily || {};
const defaultFontFamily = defaultTheme.fontFamily;

console.log('Default fontFamily:');
console.log(JSON.stringify(defaultFontFamily, null, 2));
console.log('\nCustom fontFamily:');
console.log(JSON.stringify(customFontFamily, null, 2));
"

echo ""
echo "============================="
