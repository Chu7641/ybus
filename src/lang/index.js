import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import Vietnamese from './locales/vi_VN.js';
import English from './locales/en_US.js';

export const Context = React.createContext();

//const local = navigator.language;
const local = 'en';

let lang = Vietnamese;
if (local === 'en') {
    lang = English;
} else {
    if (local === 'vi') {
        lang = Vietnamese;
    }
}

const Wrapper = (props) => {
    const [locale, setLocale] = useState(local);

    const [messages, setMessages] = useState(lang);

    function selectLanguage(e) {
        const newLocale = e.target.value;
        setLocale(newLocale);
        if (newLocale === 'en') {
            setMessages(English);
        } else {
            if (newLocale === 'vi') {
                setMessages(Vietnamese);
            }
        }
    }

    // return (
    //     <Context.Provider value={{ locale, selectLanguage }}>
    //         <IntlProvider messages={messages} locale={locale}>
    //             {props.children}
    //         </IntlProvider>
    //     </Context.Provider>

    // );

    return (
        <Context.Provider value={{ locale: 'vi', selectLanguage }}>
            <IntlProvider messages={messages} locale={locale}>
                {props.children}
            </IntlProvider>
        </Context.Provider>

    );
}


export default Wrapper;