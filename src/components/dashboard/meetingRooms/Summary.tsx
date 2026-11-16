import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { ValueState } from "../../../states/mobx-form";
import { OrangeryPrice } from "../../OrangeryElements";
import { AssetState, MeetingRoomState } from "./HandleRoomForm";
import { useFloors } from "../../../queries/floor";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { useDepartments } from "../../../queries/department";

export default function Summary({ state }: { state: MeetingRoomState }) {
  const globalState = useGlobalState();
  const { data: floors } = useFloors(globalState.office_uuid) || [];
  const { data: departmentss } = useDepartments(globalState.office_uuid) || [];
  const selectedFloor =
    floors?.find((floor) => floor.uuid === state.floor_uuid.value) || "";
  const selectedDepartment =
    departmentss?.find(
      (department) => department.uuid === state.department_uuid.value
    ) || "";
  return (
    <>
      <Box>
        <Typography fontSize={24} fontWeight={700} color={"#2B2E33"} pl={3}>
          {state.name.value}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"#2B2E33"}
          pl={3}
          pb={3}
        >
          {state.description.value ? state.description.value : "No description"}
        </Typography>
        <Box
          sx={{
            borderTop: "1px solid #C9CCD2",
            borderBottom: "1px solid #C9CCD2",
            display: "flex",
            alignItems: "center",
            "& .flex": {
              flex: 1,
              py: 2,
              borderRight: "1px solid #C9CCD2",
              pl: 3,
              "&:last-child": { borderRight: "none" },
            },
          }}
        >
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Floor
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {selectedFloor ? selectedFloor.name : "No floor"}
            </Typography>
            <Box sx={{ borderRight: "1px solid #C9CCD2" }} />
          </span>
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Department
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {selectedDepartment ? selectedDepartment.name : "No department"}
            </Typography>
            <Box sx={{ borderRight: "1px solid #C9CCD2" }} />
          </span>
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Capacity
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {state.capacity.value ? state.capacity.value : "No capacity"}
            </Typography>
          </span>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #C9CCD2",
            borderBottom: "1px solid #C9CCD2",
            display: "flex",
            alignItems: "center",
            "& .flex": {
              flex: 1,
              py: 2,
              borderRight: "1px solid #C9CCD2",
              pl: 3,
              "&:last-child": { borderRight: "none" },
            },
          }}
        >
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Price (Per Hour)
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {state.price.value ? (
                <OrangeryPrice euro={state.price.value} germanFormat />
              ) : (
                "No price"
              )}
            </Typography>
            <Box sx={{ borderRight: "1px solid #C9CCD2" }} />
          </span>
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Daily Price
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {state.daily_price.value ? (
                <OrangeryPrice euro={state.daily_price.value} germanFormat />
              ) : (
                "No daily price"
              )}
            </Typography>
            <Box sx={{ borderRight: "1px solid #C9CCD2" }} />
          </span>
          <span className="flex">
            <Typography fontSize={15} fontWeight={600} color={"#A5AAB4"}>
              Hours to Daily
            </Typography>
            <Typography fontSize={19} fontWeight={700} color={"#2B2E33"}>
              {state.number_of_hours_to_daily_price.value
                ? state.number_of_hours_to_daily_price.value
                : "No hours to daily price"}
            </Typography>
          </span>
        </Box>

        <Box
          sx={{
            py: 2,
            pr: 4,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography fontSize={20} fontWeight={600} color={"#A5AAB4"} pl={3}>
            Assets
          </Typography>
          <SelectedAssets state={state} />
        </Box>
      </Box>
    </>
  );
}

const SelectedAssets = ({ state }: { state: MeetingRoomState }) => {
  return (
    <>
      {state.assets.values
        ?.slice()
        .sort((a, b) =>
          a.value.grouped_name.value > b.value.grouped_name.value ? 1 : -1
        )
        .map((asset, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 1,
            }}
          >
            <Typography
              flexGrow={1}
              fontSize={19}
              fontWeight={600}
              color={"#55585C"}
              pl={3}
              flexBasis="40%"
            >
              {asset.value.grouped_name.value}
            </Typography>
            {asset.value.asset_type.value === "Included" && (
              <Included asset={asset} />
            )}
            {asset.value.asset_type.value === "Optional" && (
              <Optional asset={asset} state={state} />
            )}
          </Box>
        ))}
    </>
  );
};

const Included = ({ asset }: { asset: ValueState<AssetState> }) => {
  return (
    <>
      <Observer>
        {() => (
          <Typography fontSize={19} fontWeight={600}>
            Included
          </Typography>
        )}
      </Observer>
    </>
  );
};
const Optional = ({
  asset,
  state,
}: {
  asset: ValueState<AssetState>;
  state: MeetingRoomState;
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexGrow: 1,
          textAlign: "end",
          "& .cell": {
            fontSize: "19px",
            fontWeight: 600,
            color: "#0E0F11",
            flex: 1,
            flexBasis: "10%",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Observer>
          {() => (
            <Typography className="cell">
              Quantity:{" "}
              {asset.value.quantity.value ? asset.value.quantity.value : "-"}
            </Typography>
          )}
        </Observer>
        <Observer>
          {() => (
            <Typography className="cell">
              Price/Item:{" "}
              {asset.value.price.value ? (
                <OrangeryPrice euro={asset.value.price.value} germanFormat />
              ) : (
                "-"
              )}
            </Typography>
          )}
        </Observer>
        <Observer>
          {() => (
            <Typography className="cell">
              Total Price:
              {asset.value.price.value ? (
                <OrangeryPrice
                  euro={asset.value.quantity.value * asset.value.price.value}
                  germanFormat
                />
              ) : (
                "-"
              )}
            </Typography>
          )}
        </Observer>
      </Box>
    </>
  );
};
