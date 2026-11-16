//React and Next
import React, { useEffect } from 'react';
//material-ui
import { Box, Button, Typography, Grid, Divider, Checkbox, FormControlLabel, Pagination, debounce, Input, InputAdornment } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
//Orangery elements & internal dependencies
import {
  OrangeryCloseButton,
  OrangeryFormWrapper,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangerySearchInput,
  OrangeryText,
} from '../../../OrangeryElements';
// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import SearchIcon from "@mui/icons-material/Search";

//Queries & Backend
import { IHubSpotContact, useHubSpotContacts } from '../../../../queries/apps/hubspot';
import Fuse from 'fuse.js';
import { makeAutoObservable } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';

const options = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  useExtendedSearch: false,
  threshold: 0.4,
  location: 0,
  distance: 400,
  shouldSort: true,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["firstname", "lastname", "email", "lifecyclestage"],
};

export class ContactsListState {

  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }

}

export default function HubSpotContactsList({ handleClose }: { handleClose: () => void }) {
  const { data: contacts, isLoading: contactsIsLoading } = useHubSpotContacts();
  const [page, setPage] = React.useState(0);
  const limit = 6;

  function getManipulatedList(
    contacts: IHubSpotContact[],
    search: string,
  ) {
    let contactsList = JSON.parse(JSON.stringify(contacts));
    if (search) {
      const fuse = new Fuse(contactsList, options);
      contactsList = fuse.search(search).map((r) => r.item);
    }
    return contactsList;
  }

  const state = React.useMemo(() => new ContactsListState(), []);

  return contactsIsLoading ? (
    <Box
      sx={{
        height: '100vh',
        width: 570,
        maxHeight: 770,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <OrangeryNavigationContentLoader />
    </Box>
  ) : (
    <>
      <Box
        sx={{
          height: '100vh',
          maxHeight: 770,
          width: 570,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            pr: 3,
            pl: 4,
            pt: 2.5,
            pb: 2,
            borderBottom: '1px solid #EDEEF0',
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '80%',
              color: '#2B2E33',
            }}
          >
            {"Today's created users"}
          </Typography>
          <OrangeryCloseButton onClose={handleClose} noAbsolute />
        </Box>
        {contacts && contacts.length > 0 ? (
          <>
            <Header state={state} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                px: 3,
                rowGap: 1.8,
                overflowY: 'auto',
                height: `calc(100% - 260px)`,
                '&::-webkit-scrollbar': {
                  width: '0.4em',
                },
                '&::-webkit-scrollbar-track': {
                  marginLeft: '20px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,.1)',
                  borderRadius: 5,
                },
              }}
            >
              <Observer>
                {() => {
                  const manipulatedList = getManipulatedList(
                    contacts,
                    state.search,
                  ).slice(page * limit, page * limit + limit);
                  return (
                    manipulatedList && manipulatedList.length > 0
                      ? <ContactsRows
                        contacts={manipulatedList}
                      />
                      : <OrangeryNavigationPlaceholder
                        vertical
                        width={106}
                        height={112}
                        title={"No contact found!"}
                        subtitle={"Try something else"}
                        PlaceholderSvg={PlaceholderSvg}
                        // AddNewButton={<AddNewDoorAccessButton />}
                        addNewButtonText={""}
                      />
                  );
                }}
              </Observer>
            </Box>
          </>
        ) :
          (<OrangeryNavigationPlaceholder
            smallFont
            vertical
            width={106}
            height={112}
            title={contacts ? "No users have been created today." : "Make sure from the Hubspot token and/or the scopes."}
            subtitle={""}
            PlaceholderSvg={PlaceholderSvg}
            // AddNewButton={<AddNewDoorAccessButton />}
            addNewButtonText={""}
          />)
        }
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            px: 3,
            pt: 2.5,
            pb: 2,
            justifyContent: 'space-between',
            borderTop: '1px solid #EDEEF0',
          }}
        >
          <Observer>
            {() => (
              <Pagination
                count={Math.floor((getManipulatedList(
                  contacts ?? [],
                  state.search,
                ).length ?? 0) / 10) + 1 || 0}
                shape="rounded"
                onChange={(event, value) => {
                  setPage(value - 1);
                }}
              />
            )}
          </Observer>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ height: 55, width: 105, fontSize: 18, fontWeight: 600 }}
          >
            OK
          </Button>
        </Box>
      </Box>
    </>
  );
}

const HubSpotContactCard = ({ contact, lastContact }: { contact: IHubSpotContact; lastContact: boolean }) => {
  return (
    <Box
      sx={{
        height: 70,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: lastContact ? 'unset' : '1px solid #EDEEF0',
        rowGap: 1,
        flex: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>
          {contact.firstname || contact.lastname
            ? (<OrangeryText text={contact.firstname + ' ' + (contact.lastname ?? '')} limit={30} />)
            : (<OrangeryText text={contact.email} limit={30} />)}
        </Typography>
        {contact.lifecyclestage && (
          <Box
            sx={{
              height: 26,
              backgroundColor: '#EDEEF0',
              borderRadius: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
            }}
          >
            <Typography color={'primary.light'} sx={{ fontSize: 12, fontWeight: 600 }}>
              {contact.lifecyclestage}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography color={'grey.A400'} sx={{ fontSize: 14, fontWeight: 600 }}>
          {contact.email}
        </Typography>
        <Typography color={'grey.A400'} sx={{ fontSize: 12, fontWeight: 400 }}>
          {new Date(contact.createdate).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          })}
        </Typography>
      </Box>
    </Box>
  );
};


const ContactsRows = ({
  contacts,
}: {
  contacts: IHubSpotContact[];
}) => {
  return (
    <>
      {contacts?.map((contact, idx) => (
        <HubSpotContactCard key={contact.hs_object_id} contact={contact}
          lastContact={idx === contacts.length - 1}
        />
      ))}
    </>
  );
};

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: ContactsListState }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",

            my: 2,
            flexFlow: {
              sx: "column",
              sm: "row",
            },
          }}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1, pt: 1, px: 3 }}
          >
            <Box
              sx={{
                borderRadius: 2,
                height: 55,
                backgroundColor: (theme) => theme.palette.grey[200],
                display: "flex",
                alignItems: "center",
                gap: 3,
                px: 2,
                width: "100%",

              }}
            >
              <Input
                disableUnderline={true}
                onChange={(e) => {
                  handleFilter(e.target.value.toLowerCase());
                }}
                sx={{
                  width: "100%",
                  "& .MuiInput-input": {
                    fontSize: '17px !important', fontWeight: "400 !important",
                    color: '#505357 !important', backgroundColor: 'transparent !important'
                  },
                }}
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </Box>
          </Box>
        </Box>
      </>
    );
  }
);