module.exports = {
  'shared-orch-bootstrap': {
    description: 'Bootstrap profile: check SSOT files and basic structure only',
    checks: ['env.sw-root', 'env.required-dir', 'env.required-file'],
    severityPolicy: {
      ERROR: 'fail',
      WARN: 'warn',
      OK: 'pass'
    },
    runAudit: false,
    runDevCheck: false,
    runReportValidation: false,
    runTodoCheck: false
  },
  'shared-orch-doctor': {
    description: 'Doctor profile: full environment + audit + dev-check',
    checks: ['env.*', 'script.*', 'audit.*', 'dev-check.*'],
    severityPolicy: {
      ERROR: 'fail',
      WARN: 'warn',
      OK: 'pass'
    },
    runAudit: true,
    runDevCheck: true,
    runReportValidation: false,
    runTodoCheck: false
  },
  'ci-strict': {
    description: 'CI profile: strict mode, WARN also fails',
    checks: ['env.*', 'script.*', 'audit.*', 'dev-check.*'],
    severityPolicy: {
      ERROR: 'fail',
      WARN: 'fail',
      OK: 'pass'
    },
    runAudit: true,
    runDevCheck: true,
    runReportValidation: false,
    runTodoCheck: false
  },
  'report-validation': {
    description: 'Report validation profile: check HANDOVER and recent reports',
    checks: ['env.*', 'script.*', 'report.*', 'todo.*'],
    severityPolicy: {
      ERROR: 'fail',
      WARN: 'warn',
      OK: 'pass'
    },
    runAudit: false,
    runDevCheck: false,
    runReportValidation: true,
    runTodoCheck: true
  }
};
