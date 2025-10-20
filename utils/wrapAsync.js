//this contains some extra files

module.exports=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}