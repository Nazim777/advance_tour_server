import {TourModel} from '../Models/TourModels.js'

export const getAllTour = async(req,res,next)=>{
    try {

       
        let queryObj = {...req.query}
        let excludeFields = ['page','sort','limit','fields']
        excludeFields.forEach((el)=>delete queryObj[el])
        // console.log(queryObj)


         // filtering 
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log('queryString',queryStr)
        let query = TourModel.find(JSON.parse(queryStr))
        

        //sort
        if(req.query.sort){
            let sortdBy = req.query.sort.split(',').join(' ')
            // console.log(sortedBy)
            query = query.sort(sortdBy)
        }else{
            query = query.sort("-createdAt")
        }


        // limiting fileds
        if(req.query.fields){
            let fields = req.query.fields.split(',').join(' ')
            //  console.log(fields)
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }


        // pagination

        const page = req.query.page*1 || 1
        const limit = req.query.limit*1 || 100
        const skip = (page-1)*limit
        query.skip(skip).limit(limit)

        if(req.query.page){
            const CountTour = await TourModel.countDocuments()
            if(skip>CountTour){
                throw new Error('someting went wrong in pagination!')
            }
        }
        



        const tours = await query
    res.json({
        result : tours.length,
        data: tours
    })
    } catch (error) {
        console.log(error)
    }
}


export const getTourStats = async(req,res,next)=>{
    
    try {
        const stats = await TourModel.aggregate([
            {
                $match:{ratingsAverage:{$gte:4.5}}
            },
            {
                $group:{
                    _id:"$difficulty",
                    averagePrice:{$avg:"$price"},
                    averageRatings:{$avg:"$ratingsAverage"},
                    minPrice:{$min:"$price"},
                    maxPrice:{$max:"$price"}
                    
                }
            },
            {
                $sort:{
                    averagePrice:1
                }
            }
        ])



        res.json({
            status:"success",
            result:stats.length,
            data: stats
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            status:"failed",
            error:error
        })
    }

}


export const getMonthlyPlan = async(req,res,next)=>{
    try {
        const year = req.params.year*1 // 2021
        // console.log(new Date(`${year}-1-1`))

        const plan = await TourModel.aggregate([
           {
            $unwind:"$startDates"
           }
        ])
    
        res.status(200).json({
          status: 'success',
          data: {
            plan
          }
        });
    } catch (error) {
        console.log(error)
        res.json({
            status:"failed",
            error:error
        })
    }
}
