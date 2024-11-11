namespace NodeJS{
    interface ProcessEnv{

        //Application
        PORT:number;

        //Database
        DB_NAME:string;
        DB_PORT:number;
        DB_USERNAME:string;
        DB_PASSWORD:string;
        DB_HOST:string;

        //S3
        S3_SECRET_KEY:string;
        S3_ACCESS_KEY:string;
        S3_BUCKET_NAME:string;
        S3_ENDPOINT:string;

        //JWT
        REFRESH_TOKEN_SECRET:string;
        ACCESS_TOKEN_SECRET:string;
    }
}