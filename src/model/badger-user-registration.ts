
export class BadgerUserRegistration {

    private username: string;
    private password: string;
    private refCode: string;

    public constructor(username: string, password: string, refCode: string) {
        this.username = username;
        this.password = password;
        this.refCode = refCode;
    }
}
