export class ModalComponent {
    public static showMessage(title: string, message: string, buttonText: string = 'Зрозуміло!'): void {
        const overlay = document.createElement('div');
        overlay.className = 'modal-backdrop fade show position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50';
        overlay.style.zIndex = '1050';

        const modalBox = document.createElement('div');
        modalBox.className = 'position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4';
        modalBox.style.zIndex = '1055';
        modalBox.style.maxWidth = '450px';
        modalBox.style.width = '90%';

        const p = document.createElement('p');
        p.className = 'fs-5 mb-4 text-secondary';
        p.innerText = message;

        const btnWrap = document.createElement('div');
        btnWrap.className = 'text-end';

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary px-4';
        btn.innerText = buttonText;
        btn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modalBox);
        };

        btnWrap.appendChild(btn);
        modalBox.appendChild(p);
        modalBox.appendChild(btnWrap);

        document.body.appendChild(overlay);
        document.body.appendChild(modalBox);
    }

    public static promptUserModal(
        promptText: string,
        onSubmit: (val: string) => void,
        onCancel?: () => void,
    ): void {
        const overlay = document.createElement('div');
        overlay.className = 'modal-backdrop fade show position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50';
        overlay.style.zIndex = '1050';

        const modalBox = document.createElement('div');
        modalBox.className = 'position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4';
        modalBox.style.zIndex = '1055';
        modalBox.style.maxWidth = '450px';
        modalBox.style.width = '90%';

        const title = document.createElement('h5');
        title.className = 'mb-3 text-secondary';
        title.innerText = promptText;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'ID';
        input.className = 'form-control mb-3';

        const btnWrap = document.createElement('div');
        btnWrap.className = 'd-flex justify-content-end gap-2';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.innerText = 'Скасувати';
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modalBox);
            if (onCancel) onCancel();
        };

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn btn-primary';
        submitBtn.innerText = 'Зберегти';
        submitBtn.onclick = () => {
            const val = input.value.trim();
            document.body.removeChild(overlay);
            document.body.removeChild(modalBox);
            onSubmit(val);
        };

        btnWrap.appendChild(cancelBtn);
        btnWrap.appendChild(submitBtn);

        modalBox.appendChild(title);
        modalBox.appendChild(input);
        modalBox.appendChild(btnWrap);

        document.body.appendChild(overlay);
        document.body.appendChild(modalBox);
    }
}