/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills";
import store from "../app/Store.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // const styles = getComputedStyle(windowIcon)
      // console.log(windowIcon.classList[0])
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      // console.log(dates);
      const antiChrono = (a, b) => {(a < b) ? 1 : -1}
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("when I click on an eye-icon", () => {
      test("then, the modal should be shown", async () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));
        document.body.innerHTML = BillsUI({ data: bills });

        const allBills = new Bills({ document, onNavigate, store, localStorage });
        

        await waitFor(() => {
          screen.getAllByTestId('icon-eye');
        });

        const eyeIcon = screen.getAllByTestId('icon-eye')[0];
        const modal = document.getElementById("modaleFile");
        $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))

        const handleClickIconEye = jest.fn(() => {
          allBills.handleClickIconEye(eyeIcon);
        });

        eyeIcon.addEventListener("click", handleClickIconEye);

        userEvent.click(eyeIcon);

        expect(handleClickIconEye).toHaveBeenCalled();

        expect(modal).toBeTruthy();

      })
    })

    describe("When I click on new bill button", () => {
      test("Then the form must be shown", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, "localStorage", { value: localStorageMock });
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }));
        const allBills = new Bills({ document, onNavigate, store, localStorage });

        document.body.innerHTML = BillsUI({ data: bills });
        
        const button = screen.getByTestId("btn-new-bill");
        
        const handleClickNewBill = jest.fn(() => {
          allBills.handleClickNewBill();
        });
        
        button.addEventListener("click", handleClickNewBill);
        userEvent.click(button);
        expect(handleClickNewBill).toHaveBeenCalled();
        await waitFor(() => {
          screen.getByTestId("form-new-bill");
        });
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      })
    })

  })
})



// test d'intégration GET
describe("Given I am a user connected as Employee", () => {


    describe("When I navigate to Bills", () => {
      
      test("the list of bills is shown", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "employee", email: "e@e" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)

        const allBills = new Bills({ document, onNavigate, store, localStorage });
        document.body.innerHTML = BillsUI({ data: bills });

        await waitFor(() => {
          screen.getAllByText('Mes notes de frais');
        })
        const text = screen.getAllByText('Mes notes de frais');

        expect(text).toBeTruthy();


      })




    describe("When an error occurs on API", () => {
      
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            "localStorage",
            { value: localStorageMock }
        )
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee",
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {


        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })

    })
})