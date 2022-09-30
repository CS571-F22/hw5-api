
import { v4 as uuidv4 } from 'uuid';

export class BadgerMessage {

    private title: string;
    private content: string;
    private creationDate: Date;
    private id: string;

    private constructor(id: string, title: string, content: string, creationDate: Date) {
        this.title = title;
        this.content = content;
        this.creationDate = creationDate;
        this.id = id;
    }

    public static constructNewMessage(title: string, content: string): BadgerMessage {
        return new BadgerMessage(uuidv4(), title, content, new Date());
    }

    public static constructMessage(id: string, title: string, content: string, creationDate: Date) {
        return new BadgerMessage(id, title, content, creationDate);
    }


}
