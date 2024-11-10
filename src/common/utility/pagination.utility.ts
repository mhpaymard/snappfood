export function paginationSolver(page:number=1,limit:number=10){
    if(!page ||  page<=1){
        page=0;
    }else{
        page = page-1;
    }

    if(!limit || limit<1) limit=10;
    const skip = page * limit;
    return{
        page:page+1,
        limit,
        skip
    }
}

export function paginationGenerator(count:number=0,page:number=1,limit:number=10){
    return {
        totalCount: count,
        page,
        limit,
        pageCount: Math.ceil(count/limit)
    }
}