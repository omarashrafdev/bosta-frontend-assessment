import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  StackDivider,
  Flex,
  Button,
  Image,
  useSteps,
} from "@chakra-ui/react";
import {
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TbPlaylistAdd, TbPackage } from "react-icons/tb";
import { useMediaQuery } from "@chakra-ui/react";

function App() {
  const [shipmentData, setShipmentData] = useState(null);
  const { t } = useTranslation();
  const currentLanguage = useSelector((state) => state.lang.lng);

  // Extract the tracking number from the URL parameters
  const queryParams = new URLSearchParams(location.search);
  const trackingNumber = queryParams.get("tracking-number");

  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

  useEffect(() => {
    // Fetch data from the API {7234258, 13737343, 67151313}
    fetch(`https://tracking.bosta.co/shipments/track/${trackingNumber}`)
      .then((response) => response.json())
      .then((data) => setShipmentData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Fetch data only once when the component mounts

  const steps = [
    { title: t("TICKET_CREATED"), description: "TICKET_CREATED" },
    {
      title: t("PACKAGE_RECEIVED"),
      description: "PACKAGE_RECEIVED",
    },
    { title: t("OUT_FOR_DELIVERY"), description: "OUT_FOR_DELIVERY" },
    { title: t("DELIVERED"), description: "DELIVERED" },
  ];

  const determineActiveStep = () => {
    if (!shipmentData) return 0;

    const events = shipmentData.TransitEvents;
    let index = -1;

    // Check if the events array contains specific states
    if (events.some((event) => event.state === "TICKET_CREATED")) {
      index = 0; // Set index to 1 if TICKET_CREATED is found
    }
    if (events.some((event) => event.state === "PACKAGE_RECEIVED")) {
      index = 1; // Set index to 2 if PACKAGE_RECEIVED is found
    }
    if (events.some((event) => event.state === "OUT_FOR_DELIVERY")) {
      index = 2; // Set index to 3 if OUT_FOR_DELIVERY is found
    }
    if (events.some((event) => event.state === "DELIVERED")) {
      index = 3; // Set index to 4 if DELIVERED is found
    }

    // Default to 0 if none of the specific states are found
    return index;
  };

  const determineShipmentStatus = () => {
    if (!shipmentData) return 0;
    const shipmentState = shipmentData.CurrentStatus.state;
    const red = ["CANCELLED", "DELIVERED_TO_SENDER"];
    const yellow = [
      "NOT_YET_SHIPPED",
      "OUT_FOR_DELIVERY",
      "IN_TRANSIT",
      "PACKAGE_RECEIVED",
      "TICKET_CREATED",
      "WAITING_FOR_CUSTOMER_ACTION",
    ];
    const green = ["DELIVERED"];

    if (red.some((state) => state === shipmentState)) return 0;
    if (yellow.some((state) => state === shipmentState)) return 1;
    if (green.some((state) => state === shipmentState)) return 2;
  };

  const { activeStep } = useSteps({
    index: determineActiveStep(),
    // index: 3,
    count: steps.length,
  });

  const formatTime = (timeString) => {
    const time = new Date("2000-01-01T" + timeString);
    return time.toLocaleString(currentLanguage === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className={currentLanguage === "ar" ? "arabic-font" : "english-font"}>
      <Navbar />
      <VStack margin={isLargerThan1200 ? "80px 100px" : "40px 50px"} gap="30px">
        <VStack
          w="100%"
          border="1px solid"
          borderColor="RGBA(0, 0, 0, 0.08)"
          divider={<StackDivider borderColor="RGBA(0, 0, 0, 0.08)" />}
        >
          {/* Check if shipmentData exists before rendering */}
          {shipmentData && (
            <Flex
              w="100%"
              padding="25px"
              direction={
                (currentLanguage === "ar") & isLargerThan800
                  ? "row-reverse"
                  : (currentLanguage === "en") & isLargerThan800
                  ? "row"
                  : !isLargerThan800 && "column"
              }
              gap={!isLargerThan800 ? "25px" : "0px"}
              justifyContent="space-between"
            >
              {/* Vendor information */}
              <VStack
                align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
              >
                <Text color="gray">
                  {t("رقم الشحنة")} {shipmentData.TrackingNumber}
                </Text>
                <Text
                  fontWeight="bold"
                  color={
                    determineShipmentStatus() === 0
                      ? "#E30613"
                      : determineShipmentStatus() === 1
                      ? "#f8bb02"
                      : "#35b600"
                  }
                >
                  {t(shipmentData.CurrentStatus.state)}
                </Text>
              </VStack>
              {/* Last update */}
              <VStack
                align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
              >
                <Text color="gray">{t("اخر تحديث")}</Text>
                <Text fontWeight="bold">
                  {new Date(
                    shipmentData.CurrentStatus.timestamp
                  ).toLocaleString()}
                </Text>
              </VStack>
              {/* Merchant name */}
              <VStack
                align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
              >
                <Text color="gray">{t("اسم التاجر")}</Text>
                <Text fontWeight="bold">{shipmentData.provider}</Text>
              </VStack>
              {/* Promised delivery date */}
              <VStack
                align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
              >
                <Text color="gray">{t("موعد التسليم خلال")}</Text>
                <Text fontWeight="bold">
                  {new Date(shipmentData.PromisedDate).toLocaleDateString()}
                </Text>
              </VStack>
            </Flex>
          )}
          {/* Stepper component */}
          <Box position="relative" w="85%" marginBottom="25px">
            <Stepper
              size="md"
              colorScheme={
                determineShipmentStatus() === 0
                  ? "red"
                  : determineShipmentStatus() === 1
                  ? "yellow"
                  : "green"
              }
              index={determineActiveStep()}
              paddingTop={isLargerThan800 ? "20px" : "10px"}
              paddingBottom={isLargerThan800 ? "50px" : "10px"}
              gap={0}
              orientation={!isLargerThan800 ? "vertical" : "horizontal"}
              height={!isLargerThan800 ? "400px" : "auto"}
            >
              {steps.map((step, index) => (
                <Step key={index} gap={0}>
                  <Flex
                    direction={!isLargerThan800 ? "row" : "column"}
                    alignItems={isLargerThan800 ? "center" : "normal"}
                  >
                    <StepIndicator
                      bg={
                        (determineShipmentStatus() === 0) &
                        (index === determineActiveStep())
                          ? "#E30613"
                          : (determineShipmentStatus() === 1) &
                            (index === determineActiveStep())
                          ? "#f8bb02"
                          : (determineShipmentStatus() === 2) &
                              (index === determineActiveStep()) && "#35b600"
                      }
                      // bg={index === determineActiveStep() && "red"}
                    >
                      <StepStatus
                        complete={<CheckIcon color="white" />}
                        incomplete={
                          index === 0 ? (
                            <TbPlaylistAdd color="gray" />
                          ) : index === 1 ? (
                            <TbPackage color="gray" />
                          ) : index === 2 ? (
                            <TbPlaylistAdd color="gray" />
                          ) : (
                            index === 3 && <TbPackage color="gray" />
                          )
                        }
                        active={<CheckIcon color="white" />}
                      />
                    </StepIndicator>
                    <Box
                      top={!isLargerThan800 ? "0px" : "40px"}
                      left={!isLargerThan800 ? "20px" : "auto"}
                      position={!isLargerThan800 ? "relative" : "absolute"}
                      minWidth="max-content"
                    >
                      <StepTitle fontWeight="bold">{step.title}</StepTitle>
                    </Box>
                  </Flex>
                  {isLargerThan800 ? (
                    <StepSeparator className="horizontal-step__separator" />
                  ) : (
                    <StepSeparator className="vertical-step__separator" />
                  )}
                </Step>
              ))}
            </Stepper>
          </Box>
        </VStack>
        {/* Flex container for shipment details and delivery address */}
        <Flex
          w="100%"
          direction={
            (currentLanguage === "ar") & isLargerThan1200
              ? "row-reverse"
              : (currentLanguage === "en") & isLargerThan1200
              ? "row"
              : !isLargerThan1200 && "column"
          }
          gap="15px"
        >
          {/* Shipment details */}
          <VStack
            align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
            gap="15px"
          >
            <Text fontWeight="bold">{t("تفاصيل الشحنة")}</Text>
            <TableContainer w="100%">
              <Table variant="simple" borderWidth="1px" borderColor="gray.200">
                <Thead bg="rgba(250,251,251,255)">
                  {currentLanguage === "ar" ? (
                    <Tr>
                      <Th dir="rtl">{t("تفاصيل")}</Th>
                      <Th dir="rtl">{t("الوقت")}</Th>
                      <Th dir="rtl">{t("التاريخ")}</Th>
                      <Th dir="rtl" padding="16px 24px">
                        {t("الفرع")}
                      </Th>
                    </Tr>
                  ) : (
                    <Tr>
                      <Th padding="16px 24px">{t("الفرع")}</Th>
                      <Th>{t("التاريخ")}</Th>
                      <Th>{t("الوقت")}</Th>
                      <Th>{t("تفاصيل")}</Th>
                    </Tr>
                  )}
                </Thead>
                <Tbody>
                  {shipmentData?.TransitEvents.map((event, index) => (
                    <Tr key={index}>
                      {currentLanguage === "ar" ? (
                        <>
                          <Td dir="rtl">{t(event?.state)}</Td>
                          <Td dir="rtl">
                            {formatTime(
                              event?.timestamp.split("T")[1].split(".")[0]
                            )}
                          </Td>
                          <Td dir="rtl">{event?.timestamp.split("T")[0]}</Td>
                          <Td dir="rtl">{event?.hub}</Td>
                        </>
                      ) : (
                        <>
                          <Td>{event?.hub}</Td>
                          <Td>{event?.timestamp.split("T")[0]}</Td>
                          <Td>
                            {formatTime(
                              event?.timestamp.split("T")[1].split(".")[0]
                            )}
                          </Td>
                          <Td>{t(event?.state)}</Td>
                        </>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
          {/* Delivery address */}
          <VStack
            align={currentLanguage === "ar" ? "flex-end" : "flex-start"}
            w="100%"
            gap="15px"
          >
            <Text fontWeight="bold">{t("عنوان التسليم")}</Text>
            <Text
              bg="rgba(250,251,251,255)"
              w="100%"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="5px"
              padding="15px"
              textAlign={currentLanguage === "ar" ? "right" : "left"}
            >
              {t("شبين الكوم المنوفية")}
            </Text>
            {/* Help section */}
            <Flex
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="5px"
              w="100%"
              direction={currentLanguage === "ar" ? "row-reverse" : "row"}
              justifyContent="space-evenly"
              alignItems="center"
              padding="10px"
            >
              <Box width="100px">
                <Image src="/images/help.webp" alt="Dan Abramov" />
              </Box>
              <Flex direction="column" gap="10px">
                <Text fontWeight="bold">{t("هل يوجد مشكلة في شحنتك؟")}</Text>
                <Button colorScheme="red" borderRadius="12px">
                  {t("إبلاغ عن مشكلة")}
                </Button>
              </Flex>
            </Flex>
          </VStack>
        </Flex>
      </VStack>
    </div>
  );
}

export default App;
