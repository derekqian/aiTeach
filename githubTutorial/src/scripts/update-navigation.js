// Script to update navigation in all HTML files
const fs = require('fs');
const path = require('path');

function updateNavigation(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add navigation.css link if not present
    const cssLinkRegex = /<link[^>]*navigation\.css[^>]*>/;
    const lastLinkRegex = /(<link[^>]*>)\s*<\/head>/;
    if (!cssLinkRegex.test(content)) {
        // Calculate relative path to css directory
        const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, '..', 'css'));
        const cssPath = relativePath.split(path.sep).join('/');
        content = content.replace(
            lastLinkRegex,
            `$1\n    <link rel="stylesheet" href="${cssPath}/navigation.css">\n</head>`
        );
    }
    
    // Replace old navigation or add placeholder for new navigation
    const headerRegex = /<header>[\s\S]*?<\/header>\s*<main/;
    if (headerRegex.test(content)) {
        content = content.replace(
            headerRegex,
            '<!-- Navigation will be loaded here -->\n\n    <main'
        );
    }
    
    // Add navigation.js script if not present
    const scriptRegex = /<script[^>]*navigation\.js[^>]*>/;
    const firstScriptRegex = /(<script[^>]*>)/;
    if (!scriptRegex.test(content)) {
        // Calculate relative path to js directory
        const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, '..', 'js'));
        const jsPath = relativePath.split(path.sep).join('/');
        content = content.replace(
            firstScriptRegex,
            `<script src="${jsPath}/navigation.js"></script>\n    $1`
        );
    }
    
    fs.writeFileSync(filePath, content);
}

// Function to recursively find all HTML files
function findHtmlFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== 'components') {
            // Skip the components directory as it contains our navigation template
            results = results.concat(findHtmlFiles(filePath));
        } else if (file.endsWith('.html') && file !== 'navigation.html') {
            // Skip the navigation component file itself
            results.push(filePath);
        }
    }
    
    return results;
}

// Update all HTML files in src directory
const srcDir = path.join(__dirname, '..');
const htmlFiles = findHtmlFiles(srcDir);
htmlFiles.forEach(file => {
    console.log(`Updating ${file}...`);
    updateNavigation(file);
});