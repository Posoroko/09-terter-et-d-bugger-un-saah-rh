/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, wait, waitFor } from "@testing-library/dom"
import store from "../app/Store.js";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { data } from "jquery"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { bills } from '../fixtures/bills.js'

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, the envelope icon in the vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const mailIcon = screen.getByTestId('icon-window');

      expect(mailIcon.classList.contains('active-icon')).toBe(true);
    })
  })

  describe("when I selected a file of an unsupported format", () => {
    test("then, the input should have a value of null", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({ document, onNavigate, store, localStorageMock });
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);


      const input = screen.getByTestId("file");
      const file = new File( ["Pizza is love."],  "pizza.txt",  { type: "text/plain" } );
      input.addEventListener("change", handleChangeFile);
      fireEvent.change( input, { target: { files: [ file ] }});
      
      
      expect(handleChangeFile).toHaveBeenCalledTimes(1);
      expect(input.files).toHaveLength(0);
      
    })
    
    
  })
  describe("when I selected a file", () => {
    test("then, the input should contain 1 file", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({ document, onNavigate, store, localStorageMock });
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);


      const input = screen.getByTestId("file");
      const file = new File( ["Pizza is love."],  "pizza.jpg",  { type: "image/jpg" } );
      input.addEventListener("change", handleChangeFile);
      fireEvent.change( input, { target: { files: [ file ] }});
      
      
      expect(handleChangeFile).toHaveBeenCalledTimes(1);
      expect(input.files).toHaveLength(1);
      
    })
    
    
  })

//integration post
  describe('When I submit the form to create a new bill', () => {
    test('Then, I should be taken to the bills page', async () => {
        const newBillContainer = new NewBill({ document, onNavigate, store, localStorage });

        const newBillsUI = NewBillUI();
        document.body.innerHTML = newBillsUI;
        const form = screen.getByTestId('form-new-bill');
        const file = new File(["pizza"], "pizza.png", { type: "image/png" });
        const fileInput = screen.getByTestId('file');
        fireEvent.change(fileInput, { target: { files: [file] } });
        const typeInput = screen.getByTestId('expense-type');
        fireEvent.change(typeInput, {
            target: { value: 'Restaurants et bars' },
        });
        const nameInput = screen.getByTestId('expense-name');
        fireEvent.change(nameInput, {
            target: { value: 'pizza' },
        });
        
        const dateInput = screen.getByTestId('datepicker');
        fireEvent.change(dateInput, {
            target: { value: '2021-04-06' },
        });
        const amountInput = screen.getByTestId('amount');
        fireEvent.change(amountInput, {
            target: { value: 20 },
        });
        const vatInput = screen.getByTestId('pct');
        fireEvent.change(vatInput, {
            target: { value: 20 },
        });
        const pctInput = screen.getByTestId('pct');
        fireEvent.change(pctInput, {
            target: { value: 0 },
        });
        const commentaryInput = screen.getByTestId('commentary');
        fireEvent.change(commentaryInput, {
            target: { value: 'La meilleure pizza dans tout le grans-ouest!' },
        });

      const handleSubmit = jest.fn(newBillContainer.handleSubmit);
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();

      setTimeout(() => {
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills'])}, 1000);

    })
  })
})

