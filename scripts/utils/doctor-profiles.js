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
    runDevCheck: false
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
    runDevCheck: true
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
    runDevCheck: true
  }
};
