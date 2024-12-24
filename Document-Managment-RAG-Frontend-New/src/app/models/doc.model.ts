export class DocumentModel {
    constructor(
        public id?: string,
        public fileName?: string,
        public contentUrl?: string,
        public fileType?: string,
        public author?: string,
        public createdAt?: Date,
        public userId?: string
    ) {}
}
