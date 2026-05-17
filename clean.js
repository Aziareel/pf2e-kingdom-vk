const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'packs/items/_source');

fs.readdirSync(directory).forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(directory, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove Foundry v10+ nested metadata that causes Git churn
    if (content._stats) {
        delete content._stats.createdTime;
        delete content._stats.modifiedTime;
        delete content._stats.lastModifiedBy;
    }

    // Remove top-level timestamps
    delete content.createdTime;
    delete content.modifiedTime;

    // Force default ownership to prevent local user ID leaks
    content.ownership = { default: 0 };

    // Overwrite file with standardized formatting and Linux line endings (\n)
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
});

console.log('✨ Cleaned timestamps, reset ownership, stripped editor IDs, and normalized formatting!');