module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    APP_ENV: true,
    NO_MOCK: true,
    Constent: true,
    CustomEvnVars: true,
    EmitterExternal: true,
  },
  rules: {
    'class-methods-use-this': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-unused-expressions': 0,
    'react/no-children-prop': 0,
  },
};
