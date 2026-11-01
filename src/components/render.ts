import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { StorageService } from '../services/Storage';
import { Validation } from '../utils/validators';
import { generateNumericId } from '../utils/idGenerator';
import { ModalComponent } from './Modal';

export class AppRenderer {
    private bookRepo: Library<Book>;
    private userRepo: Library<User>;

    private bookPage = 1;
    private userPage = 1;
    private readonly pageSize = 4;

    private bookSearchQuery = '';

    private booksContainer!: HTMLElement;
    private booksPaginationContainer!: HTMLElement;
    private usersContainer!: HTMLElement;
    private usersPaginationContainer!: HTMLElement;

    constructor(appContainer: HTMLElement) {
        const savedBooks = StorageService.get<Book[]>('app_books', [
            new Book('1', 'Code Complete', 'Steve McConnell', 2004),
            new Book('2', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Роберт Мартін', 2008),
            new Book('3', 'The Pragmatic Programmer: Your Journey to Mastery', 'Ендрю Хансон, Девід Томас', 1999),
        ]);
        const savedUsers = StorageService.get<User[]>('app_users', [
            new User('1725533394038', 'Артем', 'artemkarachevtsev@gmail.com'),
            new User('1725533437798', 'Мартін', 'softwar@gmail.com'),
        ]);

        this.bookRepo = new Library<Book>(
            savedBooks.map((b) => new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedByUserId)),
        );
        this.userRepo = new Library<User>(
            savedUsers.map((u) => new User(u.id, u.name, u.email, u.borrowedBooks || [])),
        );

        this.initUI(appContainer);
    }

    private saveData(): void {
        StorageService.set('app_books', this.bookRepo.getAll());
        StorageService.set('app_users', this.userRepo.getAll());
    }

    private initUI(root: HTMLElement): void {
        root.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'container py-4';
        container.style.maxWidth = '900px';

        const header = document.createElement('h2');
        header.className = 'text-center fw-normal mb-4';
        header.innerText = 'Система Управління Бібліотекою';
        container.appendChild(header);

        container.appendChild(this.createBookFormCard());
        container.appendChild(this.createUserFormCard());
        container.appendChild(this.createBooksListCard());
        container.appendChild(this.createUsersListCard());

        root.appendChild(container);
    }

    private createBookFormCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-4 border-0 rounded-1';

        const body = document.createElement('div');
        body.className = 'card-body p-4';

        const title = document.createElement('h5');
        title.className = 'card-title fw-bold mb-3';
        title.innerText = 'Додати Книгу';

        const inputTitle = document.createElement('input');
        inputTitle.type = 'text';
        inputTitle.placeholder = 'Назва книги';
        inputTitle.className = 'form-control mb-2';

        const errTitle = document.createElement('div');
        errTitle.className = 'text-danger small mb-2 d-none';
        errTitle.innerText = 'Це поле є обов’язковим';

        const inputAuthor = document.createElement('input');
        inputAuthor.type = 'text';
        inputAuthor.placeholder = 'Автор';
        inputAuthor.className = 'form-control mb-2';

        const errAuthor = document.createElement('div');
        errAuthor.className = 'text-danger small mb-2 d-none';
        errAuthor.innerText = 'Це поле є обов’язковим';

        const inputYear = document.createElement('input');
        inputYear.type = 'text';
        inputYear.placeholder = 'Рік видання';
        inputYear.className = 'form-control mb-3';

        const errYear = document.createElement('div');
        errYear.className = 'text-danger small mb-2 d-none';
        errYear.innerText = 'Рік повинен містити 4 цифри (не більше поточного року)';

        const btnSubmit = document.createElement('button');
        btnSubmit.className = 'btn btn-success px-3';
        btnSubmit.innerText = 'Додати Книгу';

        btnSubmit.onclick = () => {
            let valid = true;
            if (!Validation.isNotEmpty(inputTitle.value)) {
                errTitle.classList.remove('d-none');
                valid = false;
            } else {
                errTitle.classList.add('d-none');
            }

            if (!Validation.isNotEmpty(inputAuthor.value)) {
                errAuthor.classList.remove('d-none');
                valid = false;
            } else {
                errAuthor.classList.add('d-none');
            }

            if (!Validation.isValidYear(inputYear.value)) {
                errYear.classList.remove('d-none');
                valid = false;
            } else {
                errYear.classList.add('d-none');
            }

            if (!valid) return;

            const newBook = new Book(
                generateNumericId(),
                inputTitle.value.trim(),
                inputAuthor.value.trim(),
                parseInt(inputYear.value.trim(), 10),
            );

            this.bookRepo.add(newBook);
            this.saveData();

            inputTitle.value = '';
            inputAuthor.value = '';
            inputYear.value = '';

            this.updateBooksList();
        };

        body.appendChild(title);
        body.appendChild(inputTitle);
        body.appendChild(errTitle);
        body.appendChild(inputAuthor);
        body.appendChild(errAuthor);
        body.appendChild(inputYear);
        body.appendChild(errYear);
        body.appendChild(btnSubmit);

        card.appendChild(body);
        return card;
    }

    private createUserFormCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-4 border-0 rounded-1';

        const body = document.createElement('div');
        body.className = 'card-body p-4';

        const title = document.createElement('h5');
        title.className = 'card-title fw-bold mb-3';
        title.innerText = 'Додати Користувача';

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.placeholder = "Ім'я";
        inputName.className = 'form-control mb-2';

        const errName = document.createElement('div');
        errName.className = 'text-danger small mb-2 d-none';
        errName.innerText = 'Це поле є обов’язковим';

        const inputEmail = document.createElement('input');
        inputEmail.type = 'email';
        inputEmail.placeholder = 'Email';
        inputEmail.className = 'form-control mb-3';

        const errEmail = document.createElement('div');
        errEmail.className = 'text-danger small mb-2 d-none';
        errEmail.innerText = 'Введіть коректний Email';

        const btnSubmit = document.createElement('button');
        btnSubmit.className = 'btn btn-success px-3';
        btnSubmit.innerText = 'Додати Користувача';

        btnSubmit.onclick = () => {
            let valid = true;
            if (!Validation.isNotEmpty(inputName.value)) {
                errName.classList.remove('d-none');
                valid = false;
            } else {
                errName.classList.add('d-none');
            }

            if (!Validation.isValidEmail(inputEmail.value)) {
                errEmail.classList.remove('d-none');
                valid = false;
            } else {
                errEmail.classList.add('d-none');
            }

            if (!valid) return;

            const newUser = new User(
                generateNumericId(),
                inputName.value.trim(),
                inputEmail.value.trim(),
            );

            this.userRepo.add(newUser);
            this.saveData();

            inputName.value = '';
            inputEmail.value = '';

            this.updateUsersList();
        };

        body.appendChild(title);
        body.appendChild(inputName);
        body.appendChild(errName);
        body.appendChild(inputEmail);
        body.appendChild(errEmail);
        body.appendChild(btnSubmit);

        card.appendChild(body);
        return card;
    }

    private createBooksListCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-4 border-0 rounded-1';

        const body = document.createElement('div');
        body.className = 'card-body p-4';

        const title = document.createElement('h5');
        title.className = 'card-title fw-bold mb-3';
        title.innerText = 'Список Книг';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Пошук за автором або назвою...';
        searchInput.className = 'form-control mb-3';
        searchInput.oninput = () => {
            this.bookSearchQuery = searchInput.value.toLowerCase().trim();
            this.bookPage = 1;
            this.updateBooksList();
        };

        this.booksContainer = document.createElement('div');
        this.booksPaginationContainer = document.createElement('div');
        this.booksPaginationContainer.className = 'd-flex justify-content-center gap-2 mt-3';

        body.appendChild(title);
        body.appendChild(searchInput);
        body.appendChild(this.booksContainer);
        body.appendChild(this.booksPaginationContainer);

        card.appendChild(body);
        this.updateBooksList();
        return card;
    }

    private updateBooksList(): void {
        this.booksContainer.innerHTML = '';
        this.booksPaginationContainer.innerHTML = '';

        let books = this.bookRepo.getAll();
        if (this.bookSearchQuery) {
            books = books.filter(
                (b) =>
                    b.title.toLowerCase().includes(this.bookSearchQuery) ||
                    b.author.toLowerCase().includes(this.bookSearchQuery),
            );
        }

        const totalPages = Math.ceil(books.length / this.pageSize) || 1;
        if (this.bookPage > totalPages) this.bookPage = totalPages;

        const start = (this.bookPage - 1) * this.pageSize;
        const paginatedBooks = books.slice(start, start + this.pageSize);

        if (paginatedBooks.length === 0) {
            this.booksContainer.innerHTML = '<p class="text-muted">Книг не знайдено.</p>';
            return;
        }

        paginatedBooks.forEach((book) => {
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

            const info = document.createElement('span');
            info.innerText = `${book.title} by ${book.author} (${book.year})`;

            const btnGroup = document.createElement('div');
            btnGroup.className = 'd-flex gap-2';

            const actionBtn = document.createElement('button');
            actionBtn.className = book.isBorrowed ? 'btn btn-warning btn-sm' : 'btn btn-primary btn-sm';
            actionBtn.innerText = book.isBorrowed ? 'Повернути' : 'Позичити';
            actionBtn.onclick = () => this.handleBorrowOrReturn(book);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm';
            deleteBtn.innerText = '×';
            deleteBtn.title = 'Видалити книгу';
            deleteBtn.onclick = () => {
                this.bookRepo.remove(book.id);
                this.saveData();
                this.updateBooksList();
            };

            btnGroup.appendChild(actionBtn);
            btnGroup.appendChild(deleteBtn);

            row.appendChild(info);
            row.appendChild(btnGroup);
            this.booksContainer.appendChild(row);
        });

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `btn btn-sm ${i === this.bookPage ? 'btn-secondary' : 'btn-outline-secondary'}`;
            pageBtn.innerText = i.toString();
            pageBtn.onclick = () => {
                this.bookPage = i;
                this.updateBooksList();
            };
            this.booksPaginationContainer.appendChild(pageBtn);
        }
    }

    private handleBorrowOrReturn(book: Book): void {
        if (book.isBorrowed) {
            const user = this.userRepo.findById(book.borrowedByUserId || '');
            book.isBorrowed = false;
            book.borrowedByUserId = undefined;
            if (user) {
                user.borrowedBooks = user.borrowedBooks.filter((id) => id !== book.id);
            }
            this.saveData();
            this.updateBooksList();
            this.updateUsersList();
            ModalComponent.showMessage(
                'Успішне повернення',
                `${book.title} by ${book.author} (${book.year}) has been returned.`,
                'Закрити',
            );
        } else {
            ModalComponent.promptUserModal(
                'Введіть ID користувача для позичення книги:',
                (userId) => {
                    if (!Validation.isValidNumericId(userId)) {
                        ModalComponent.showMessage('Помилка', 'ID користувача повинен містити лише цифри!');
                        return;
                    }
                    const user = this.userRepo.findById(userId);
                    if (!user) {
                        ModalComponent.showMessage('Помилка', `Користувача з ID ${userId} не знайдено.`);
                        return;
                    }
                    if (user.borrowedBooks.length >= 3) {
                        ModalComponent.showMessage(
                            'Ліміт вичерпано',
                            'Користувач не може позичити більше 3-х книг одночасно!',
                        );
                        return;
                    }

                    book.isBorrowed = true;
                    book.borrowedByUserId = user.id;
                    user.borrowedBooks.push(book.id);

                    this.saveData();
                    this.updateBooksList();
                    this.updateUsersList();

                    ModalComponent.showMessage(
                        'Успішне позичання',
                        `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`,
                        'Зрозуміло!',
                    );
                },
            );
        }
    }

    private createUsersListCard(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-4 border-0 rounded-1';

        const body = document.createElement('div');
        body.className = 'card-body p-4';

        const title = document.createElement('h5');
        title.className = 'card-title fw-bold mb-3';
        title.innerText = 'Список Користувачів';

        this.usersContainer = document.createElement('div');
        this.usersPaginationContainer = document.createElement('div');
        this.usersPaginationContainer.className = 'd-flex justify-content-center gap-2 mt-3';

        body.appendChild(title);
        body.appendChild(this.usersContainer);
        body.appendChild(this.usersPaginationContainer);

        card.appendChild(body);
        this.updateUsersList();
        return card;
    }

    private updateUsersList(): void {
        this.usersContainer.innerHTML = '';
        this.usersPaginationContainer.innerHTML = '';

        const users = this.userRepo.getAll();
        const totalPages = Math.ceil(users.length / this.pageSize) || 1;
        if (this.userPage > totalPages) this.userPage = totalPages;

        const start = (this.userPage - 1) * this.pageSize;
        const paginatedUsers = users.slice(start, start + this.pageSize);

        if (paginatedUsers.length === 0) {
            this.usersContainer.innerHTML = '<p class="text-muted">Користувачів немає.</p>';
            return;
        }

        paginatedUsers.forEach((user) => {
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

            const info = document.createElement('span');
            info.innerText = `${user.id} ${user.name} (${user.email}) [Книг: ${user.borrowedBooks.length}]`;

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-outline-danger btn-sm';
            delBtn.innerText = '×';
            delBtn.title = 'Видалити користувача';
            delBtn.onclick = () => {
                this.userRepo.remove(user.id);
                this.saveData();
                this.updateUsersList();
            };

            row.appendChild(info);
            row.appendChild(delBtn);
            this.usersContainer.appendChild(row);
        });

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `btn btn-sm ${i === this.userPage ? 'btn-secondary' : 'btn-outline-secondary'}`;
            pageBtn.innerText = i.toString();
            pageBtn.onclick = () => {
                this.userPage = i;
                this.updateUsersList();
            };
            this.usersPaginationContainer.appendChild(pageBtn);
        }
    }
}