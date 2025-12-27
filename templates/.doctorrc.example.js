/**
 * Doctor Configuration Example
 * 
 * このファイルをプロジェクトルートに `.doctorrc.js` として配置し、
 * doctor の挙動をカスタマイズできます。
 * 
 * 使用方法:
 *   node scripts/sw-doctor.js --config .doctorrc.js --profile my-custom-profile
 */

module.exports = {
  // プロファイル定義（shared-workflows の標準プロファイルを拡張）
  profiles: {
    'my-custom-profile': {
      description: 'Custom profile for this project',
      checks: ['env.*', 'script.*'],
      severityPolicy: {
        ERROR: 'fail',
        WARN: 'warn',
        OK: 'pass'
      },
      runAudit: false,
      runDevCheck: false
    }
  },

  // カスタム Check の定義（オプション）
  // 将来的に、プロジェクト固有の Check を追加できるようにする
  customChecks: [
    // 例:
    // {
    //   id: 'project.custom-file',
    //   description: 'Check for project-specific file',
    //   run: (projectRoot) => {
    //     const fs = require('fs');
    //     const path = require('path');
    //     const filePath = path.join(projectRoot, 'my-custom-file.md');
    //     if (fs.existsSync(filePath)) {
    //       return { severity: 'OK', message: 'Custom file exists' };
    //     } else {
    //       return { severity: 'WARN', message: 'Custom file not found' };
    //     }
    //   }
    // }
  ],

  // カスタム Fix の定義（オプション）
  customFixes: [
    // 例:
    // {
    //   checkId: 'project.custom-file',
    //   description: 'Create custom file from template',
    //   run: (projectRoot, dryRun) => {
    //     // Fix implementation
    //   }
    // }
  ]
};
