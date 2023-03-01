'use client';
import Button from '@/components/Button';
import ColoredTitle from '@/components/ColoredTitle';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MultiSelect from '../Multiselect';
import cartIcon from '@/assets/images/icons/carticon.svg';
import Image from 'next/image';
import { useState } from 'react';
import checkedIcon from '@/assets/images/icons/checked-icon.svg';
import alertIcon from '@/assets/images/icons/alert-icon.svg';
import OrderPanel from '@/components/OrderPanel';

const arrBolos = [
  { name: 'Mini', preco: 65, serves: 10, acrescimos: 10, topper: 10 },
  { name: 'Pequeno', preco: 85, serves: 20, acrescimos: 15, topper: 15 },
  { name: 'Médio', preco: 120, serves: 30, acrescimos: 20, topper: 15 },
  { name: 'Grande', preco: 160, serves: 50, acrescimos: 20, topper: 15 },
];

const arrRecheios = [
  { value: 'Alpino', label: 'Alpino' },
  { value: 'Brigadeiro Tradicional', label: 'Brigadeiro Tradicional' },
  { value: 'Brigadeiro Trufado', label: 'Brigadeiro Trufado' },
  { value: 'Brigadeiro de Leite Ninho', label: 'Brigadeiro de Leite Ninho' },
  { value: 'Mousse de Ninho', label: 'Mousse de Ninho' },
  { value: 'Ouro Branco', label: 'Ouro Branco' },
  { value: 'Prestígio', label: 'Prestígio' },
];

const arrAcrescimos = [
  { value: 'Abacaxi', label: 'Abacaxi' },
  { value: 'Ameixa', label: 'Ameixa' },
  { value: 'Bombom', label: 'Bombom' },
  { value: 'Cereja', label: 'Cereja' },
  { value: 'Geléia de Morango', label: 'Geléia de Morango' },
  { value: 'Pêssego', label: 'Pêssego' },
  { value: 'Morango', label: 'Morango' },
  { value: 'Nozes', label: 'Nozes' },
  { value: 'Raspas de Chocolate', label: 'Raspas de Chocolate' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const OrderSchema = Yup.object().shape({
  tamanho: Yup.string().required('Required'),
  recheios: Yup.array()
    .max(2, 'Máximo de 2 recheios')
    .min(1, 'Mínimo de 1 recheio')
    .required('Required'),
  topper: Yup.bool().required('Required'),
  entrega: Yup.date()
    .min(
      new Date(new Date(today).setDate(today.getDate() + 3)),
      'Data inválida',
    )
    .required('Required'),
});

export const FOrder = () => {
  function handleFieldValue(name, value) {
    setOrder(
      (currentOrder) => (currentOrder = { ...currentOrder, [name]: value }),
    );
  }
  const [sizeRef, setSizeRef] = useState(0);
  const [order, setOrder] = useState({
    tamanho: 0,
    recheios: [],
    acrescimos: [],
    topper: false,
    total: 0,
  });
  return (
    <div>
      <h3 className="text-center font-medium tracking-widest">
        Monte o bolo que desejar
      </h3>
      <Formik
        initialValues={{
          tamanho: '',
          recheios: '',
          acrescimos: '',
          topper: '',
          entrega: '',
        }}
        validationSchema={OrderSchema}
        onSubmit={(values) => {
          const total =
            sizeRef.preco +
            values.acrescimos.length * sizeRef.acrescimos +
            (values.topper && sizeRef.topper);
          const newOrder = JSON.stringify(values)
            .replaceAll(',"', '%0a')
            .replaceAll(/[{}"\[\]]/g, '')
            .replaceAll(':', ': ')
            .replace(true, 'Sim')
            .replace(false, 'Não')
            .replaceAll(' ', ' %20');
          window.location.replace(
            `https://api.whatsapp.com/send?phone=819082453134&text=${
              newOrder + `%0aTotal:%20R$${total},00`
            }`,
          );
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-8 mt-4">
            {/* // ! TAMANHO */}
            <label>
              <ColoredTitle bgColor="green" title="Tamanho" />
              <div className="flex flex-col gap-12">
                {arrBolos.map((size, index) => (
                  <div className="flex flex-col items-center gap-2" key={index}>
                    <div className="w-10/12 text-center p-2 space-y-4 bg-white">
                      <span className="text-lg text-candy-pink font-semibold">
                        {size.name}
                      </span>
                      <p>{`Serve até ${size.serves} pessoas`}</p>
                    </div>
                    <div className="radioButton">
                      <Field
                        name="tamanho"
                        type="radio"
                        value={size.name}
                        onClick={() => {
                          setSizeRef(size);
                          setOrder(
                            (currentOrder) =>
                              (currentOrder = {
                                ...currentOrder,
                                tamanho: size,
                              }),
                          );
                        }}
                      />
                      <div
                        className={`flex flex-row justify-between w-full ${
                          sizeRef.name !== size.name
                            ? 'pr-5 pl-11'
                            : 'bg-candy-green'
                        }`}
                      >
                        {sizeRef.name === size.name ? (
                          <>
                            <span className="self-center font-semibold text-center w-full">
                              ADICIONADO
                            </span>
                            <Image
                              src={checkedIcon}
                              alt="checked icon"
                              width={25}
                              height={25}
                              className="absolute right-0 top-0 bottom-0 my-auto mr-5
                              "
                            />
                          </>
                        ) : (
                          <>
                            <span className="self-center font-semibold">{`R$ ${size.preco},00`}</span>
                            <Image
                              src={cartIcon}
                              alt="cart icon"
                              width={30}
                              height={30}
                              className="w-16 py-1 bg-candy-green"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.tamanho && touched.tamanho ? (
                <div>{errors.tamanho}</div>
              ) : null}
            </label>
            {/* // ! RECHEIOS */}
            <label>
              <ColoredTitle bgColor="green" title="Até 2 Recheios" />
              <Field
                name="recheios"
                component={MultiSelect}
                isMulti={true}
                options={arrRecheios}
                placeholder="Selecione os recheios"
                handleChange={handleFieldValue}
              ></Field>
              {errors.recheios && touched.recheios ? (
                <div>{errors.recheios}</div>
              ) : null}
            </label>
            {/* // ! ACRESCIMOS */}
            <label>
              <ColoredTitle bgColor="green" title="Acréscimos" />
              <div className="grid grid-cols-1 bg-candy-green py-2 px-4 font-semibold">
                {arrBolos.map((size, index) => (
                  <div className="flex flex-row justify-between" key={index}>
                    <span>{size.name}</span>
                    <span>{`R$ ${size.acrescimos},00`}</span>
                  </div>
                ))}
              </div>
              <Field
                instanceId="acrecimos"
                name="acrescimos"
                component={MultiSelect}
                isMulti={true}
                options={arrAcrescimos}
                placeholder="Selecione os acréscimos"
                handleChange={handleFieldValue}
              ></Field>
              {errors.acrescimos && touched.acrescimos ? (
                <div>{errors.acrescimos}</div>
              ) : null}
            </label>
            {/* // ! TOPPER */}
            <label>
              <ColoredTitle bgColor="green" title="Topper" />
              <div className="grid grid-cols-1 bg-candy-green py-2 px-4 font-semibold">
                {arrBolos.map((size, index) => (
                  <div className="flex flex-row justify-between" key={index}>
                    <span>{size.name}</span>
                    <span>{`R$ ${size.topper},00`}</span>
                  </div>
                ))}
              </div>
              <Field
                instanceId="topper"
                name="topper"
                component={MultiSelect}
                isMulti={false}
                options={[
                  { value: true, label: 'Sim' },
                  { value: false, label: 'Não' },
                ]}
                placeholder="Selecione o topper"
                handleChange={handleFieldValue}
              ></Field>
              {errors.topper && touched.topper ? (
                <div>{errors.topper}</div>
              ) : null}
            </label>
            {/* // ! ENTREGA */}
            <label>
              <ColoredTitle bgColor="green" title="Data de Entrega" />
              <div>
                <Field name="entrega" type="date" />
                <span className="flex flex-row text-xs mt-1">
                  <Image
                    src={alertIcon}
                    alt="alert icon"
                    height={15}
                    className="mr-2 w-auto"
                  />
                  Encomende com no MÍNIMO 2 dias de antecedência
                </span>
              </div>
              {errors.entrega && touched.entrega ? (
                <div>{errors.entrega}</div>
              ) : null}
            </label>
            <OrderPanel order={order} />
            {/* // ! SUBMIT */}
            <Button type="submit" text="Encomendar" whatsapp />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FOrder;
