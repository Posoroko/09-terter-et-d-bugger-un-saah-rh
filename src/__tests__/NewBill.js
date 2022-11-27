/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
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
      
      expect(handleChangeFile).toBeCalled();
      expect(input.files).toHaveLength(0);
      
    })
    
  })

  describe("when I click on 'nouvelle note de frais' ", () => {
    test("then, the form should be shown", () => {




    })
  })
})

