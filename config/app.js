module.exports = {
  'secret': process.env.SECRET || 'nobody knows giaa',
  'database': process.env.DB_URL || 'mongodb://localhost:27017/giaa',
  'api_daily_quota': process.env.DAILY_QUOTA || 200,
  'cids_dir': process.env.CIDS_DIR || 'config/cids',
  'basic_auth': process.env.BASIC_AUTH || false,
  'basic_auth_user': process.env.BASIC_AUTH_USER || 'giaa',
  'basic_auth_pass': process.env.BASIC_AUTH_PASS || 'giaa'
};
