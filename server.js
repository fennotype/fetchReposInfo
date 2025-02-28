const pool = require(`./db`)
const fetchReposInfo = require(`./repositories`)
const express = require(`express`)
const app = express()
const PORT = 3000

app.get(`/repositories`, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM repositories`)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
    }
})

app.get(`/repositories/:ReposIdOrLanguage`, async (req,res)=>{
    const {ReposIdOrLanguage} = req.params;
    let result
    try{
        if(!isNaN(ReposIdOrLanguage)){
            result = await pool.query(`SELECT * FROM repositories WHERE id=$1`,[ReposIdOrLanguage])
        }else{
            result = await pool.query(`SELECT * FROM repositories WHERE language=$1`,[ReposIdOrLanguage])
        }
        if(result.rows.length > 0 ){
            res.json(result.rows)
        } else{
            res.json({Message:`репозиторий не найден`})
        }
    }catch(error){
        console.error(error)
    }
})

    // let syncInterval;
    // const startSyncInterval = () => { 
    //     clearInterval(syncInterval)
    //     syncInterval = setInterval(fetchReposInfo, 5 * 60 * 1000)
    //     console.log(`синхронизация началась`)
    // }

    // app.post(`/sync`, async (Req, res) => {
    //     try {
    //         startSyncInterval()
    //         await fetchReposInfo()
    //         res.json({ Message: `синхронизация началась` })
    //     } catch (error) {
    //         console.error(`syncInterval failed` + ` ` + error)
    //     }
    // })
startSyncInterval()

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/repositories`);
});








// хз, это теперь рудимент, но выглядит прикольно. оставлю


// app.get(`/repositories/id/:id`, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await pool.query(`SELECT * FROM repositories WHERE id = $1 OR name = $2`, [id, id])
//         if (result.rows.length > 0) {
//             res.json(result.rows[0])
//         } else {
//             res.status(404).json({ Message: `репозиторий не найдет` })
//         }
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ Message: `сервер умер` })
//     }
// })

// app.get(`/repositories/language/:language`, async(req,res)=>{
//     const {language} = req.params;
//     try{
//         const result = await pool.query(`SELECT * FROM repositories WHERE language = $1`, [language])
//         if (result.rows.length > 0){
//             res.json(result.rows)
//         }else{
//             res.status(404).json({Message: `репозиторий по языку не найдет`})
//         }
//     } catch(error){
//         console.error(error)
//     }
// })  