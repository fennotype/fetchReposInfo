const axios = require(`axios`);
const pool = require("./db");


async function fetchReposInfo() {
    console.log(`start search...`)
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=stars:>1+language:javascript&sort=stars&order=desc`)
        const result = response.data.items;
        // console.log(result)
        await SaveReposInfo(result);
    } catch (error) {
        console.error(`ошибкка:`+`  ` + error) 
    }
}


async function SaveReposInfo(result) {
    console.log(`save in database...`)
    const connectDB = await pool.connect();
    try{
        await connectDB.query('begin');
        for(const repos of result){
                const queryText =` INSERT INTO repositories (id, name, full_name, html_url, description, stargazers_count, language)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (id) DO NOTHING;`;
                const values = [repos.id, repos.name,repos.full_name,repos.html_url,repos.description, repos.stargazers_count, repos.language];
                await connectDB.query(queryText, values)
        }
        await connectDB.query(`COMMIT`)
    }catch(error){
        await connectDB.query(`ROLLBACK`)
        console.error(error)
    } finally {
        console.log(`Saving to the database is finished`)
        connectDB.release();
    }
}



const interval = 5 * 60 * 1000;
fetchReposInfo();
setInterval(fetchReposInfo, interval);
module.exports = fetchReposInfo;
