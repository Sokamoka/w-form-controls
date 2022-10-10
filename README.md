# Form Controls koncepció

## Miért?

A cél az volt, hogy megvizsgáljam a hogyan lehetne a mi igényeinknek megfelelő Form komponenseket (Input, Date Picker, ...), készíteni. Milyen problémák merülnek fel és milyen lehetséges megoldások vannak.
Továbbá az új megoldások full `Accessible` kompatibilis megoldások legyenek.

## Mit?

Az általunk leginkább használt Form elem az `Input` és az arra épülő felugró ablakos megjelenések. Ilyenek lehetnek a különböző `date pickerek`, `dropdown`, `autocomplate` elemek.
Ezért az összes alapja az Input komponens és erre épülnek a többi felugró ablakos komponensek.

## Elképzelés

Az alap elképzelés az volt, hogy az input komponens ne legyen közvetlen része a többi komponensnek. Azt "kívülről" támogassa a rá épülő többi komponens.
Ezért a `Renderless Components` tervezési minta használata tünt kézen fekvőnek. egyes komponensek csak a saját feladataikat látják el és szervesen épülnek egymásra.

```html
<w-date-picker v-model="states.birthdate" v-slot:default="{ value, click }">
  <w-input :value="value" @click="click" />
</w-date-picker>
```

Továbbá az egyes komponesek is kis egyszerű funkcionális komponensekből épülnek fel. Ezek kis építő elemek amikből bármilyen igényt ki lehet szolgálni, de készül egy általános "összépített" változat is ami az igények 90%-100%-át ki tudja elégíteni.

```html
<InputControl v-slot:default="{ id, empty }">
  <InputWrapper v-model="modelValue">
    <InputInput />
    <InputLabel>{{ label }}</InputLabel>
    <CheckIcon v-if="isValid" class="valid-icon" />
  </InputWrapper>
</InputControl>
```

A fejlesztések több okból is `composition-api`-val készültek. Ideálisbnak tünt ezt használni, plusz a Vue 3 átállásnál is könnyebb és közelebb áll a React logikához is ha esetleg Átállunk arra.

## Felmerülő "problémák"

Mivel nálunk a form elemek nagy része validálva van ezért felmerült, hogy a validálás hogyan legyen része az elemeknek. Továbbá, hogy az input elemek része legyen vagy a ráépülő elemeké.
Arra jutottam, hogy mivel a végső adatok amúgy is az inputban jelennek meg, és a pl. DatePicker Range komponensnél külön lehet validálni az inputokat, ezért az Input komponensben használjuk a validátort.

Ebből kifolyólag az hiba kijelzést (error-notice) az input komponens tartalmazza. Ez további problémákat vet fel az `InputGroup` és a felugró ablakos megoldásoknál.
Ezért egymásra épülő elemeknek kommunikálnia kell egymással és ehhez a `Provide/Inject` megoldást használtam.

További problémát jelentett az Input elem elhagyására történő validálás. Az az általunk használt Vee-Validate megoldás sajátossága, de ha a jövőben model alapú validálásra térünk egyszerűsödhet a helyzet.

## Használat

### Input

```html
<w-input
  v-model="states.text"
  v-validate="'required|email'"
  name="email"
  label="E-mail"
  placeholder="E-mail with helper text"
  helper-text="Please add valid email"
/>
```

### Input Group

```html
<w-input-group>
  <w-input
    v-model="formdata.firstName"
    v-validate="'required'"
    name="firstname"
    label="First name"
    helper-text="Please add valid characters"
  />
  <w-input v-model="formdata.middleName" label="Middle name" />
  <w-input
    v-if="isLastItemVisible"
    v-model="formdata.lastName"
    v-validate="'required'"
    name="lastname"
    label="Last name"
    error-message="Custom required error message"
  />
</w-input-group>
```

### Date Picker

```html
<w-date-picker
  v-model="formdata.birthdate"
  placement="bottom-start"
  helper-text-disabled
  v-slot:default="{ value, click }"
>
  <w-input
    :value="value"
    v-validate="'required'"
    name="birthdate-group"
    label="Birth date"
    helper-text="Press the arrow keys to navigate by day."
    helper-text-sr-only
    readonly
    @click="click"
  >
    <template v-slot:append>
      <CalendarIcon tabindex="-1" class="icon-append is-helper" />
    </template>
  </w-input>
</w-date-picker>
```

### Date Picker Range

```html
<w-date-picker-range
  v-model="states.check"
  placement="bottom"
  format="YYYY-MM-DD"
  :columns="2"
  :min-date="minDate"
  :max-date="maxDate"
  helper-text="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
  :helper-text-sr-only="true"
>
  <template v-slot:default="{ startProps, endProps: { 'data-end-id': endId, value: endDate }, inputEvents }">
    <w-input-group>
      <w-input
        v-bind="startProps"
        v-validate="'required'"
        name="checkin"
        label="Check-in"
        readonly
        v-on="inputEvents"
      />
      <w-input
        :value="endDate"
        :data-end-id="endId"
        v-validate="'required'"
        name="checkout"
        label="Check-out"
        readonly
        v-on="inputEvents"
      />
    </w-input-group>
  </template>
</w-date-picker-range>
```
