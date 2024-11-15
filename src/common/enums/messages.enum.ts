export enum BadRequestMessage{
    InValidLoginData="اطلاعات ارسال شده برای ورود صحیح نمی باشد",
    InValidRegisterData="اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
    OtpNotExpired="زمان تایید کد ارسالی هنوز منقضی نشده است"
}
export enum AuthMessage{
    NotFoundAccount="حساب کاربری یافت نشد",
    AlreadyExistsAccount="حساب کاربری با این مشخصات از قبل وجود دارد",
    ExpiredOtpCode="کد تایید منقضی شده است مجدد تلاش نمایید",
    TryAgain="دوباره تلاش کنید",
    WrongOtpCode="کد تایید اشتباه است",
    LoginAgain="مجدد وارد حساب کاربری خود شوید",
    LoginRequired="وارد حساب کاربری خود شوید"
}
export enum NotFoundMessage{
    NotFound="موردی یافت نشد",
    NotFoundCategory="دسته بندی یافت نشد",
    NotFoundUser="کاربری یافت نشد",
    NotFoundCategorySlug="دسته بندی ای با این ایدی وجود ندارد",

}
export enum ValidationMessage{
    InvalidImageFormat="فرمت تصویر باید jpg یا png باشد",
    InvalidPhoneNumber="شماره موبایل الزامی است",
    InvalidOtpCode="کد وارد شده معتبر نمی باشد"
}
export enum PublicMessages{
    SendOtp="کد با موفقیت ارسال شد",
    LoggedIn="با موفقیت وارد حساب کاربری شدید",
    Created="با موفقیت ایجاد شد",
    Deleted="با موفقیت حذف شد",
    Updated="با موفقیت به روز رسانی شد",
    Inserted="با موفقیت ایجاد شد",
    Done="با موفقیت انجام شد",
    Uploaded="با موفقیت آپلود شد"
}
export enum ConflictMessages{
    CategoryTitle="عنوان دسته بندی تکراری می باشد",
    CategorySlug="اسلاگ دسته بندی تکراری می باشد",
    Email="این ایمیل توسط شخص دیگری استفاده شده است",
    SupplierAccountPhone="فروشنده دیگری با این شماره موبایل وجود دارد",
    NationalCode="کاربر دیگری با این کدملی وجود دارد"
}