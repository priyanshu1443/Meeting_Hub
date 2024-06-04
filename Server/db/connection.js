import mongoose from "mongoose"

export const Connection = async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}`)
        .then(response => {
            console.log("Connection with database is establish")
        })
        .catch(error => {
            console.log(error)
        })
}


