const {creatClient, createClient} = require('@supabase/supabase-js')
    require('dotenv').config

const supabase = createClient(
    process.env.supabase_url,
    process.env.supabase_key
)
module.exports = supabase
