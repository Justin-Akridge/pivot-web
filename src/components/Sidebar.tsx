import { useJobContext } from "@/context/JobContext"
import { useState, useEffect } from "react";
import {
  Check,
  X
} from "lucide-react";
import { addMeasurement } from "./Viewer";

const WaitingDots = () => {
  return (
    <div className="flex items-center text-xs">
      Selection location in viewer
      <span className="dot animate-pulse"></span>
      <span className="dot animate-pulse delay-100"></span>
      <span className="dot animate-pulse delay-200"></span>
    </div>
  )
}

const Cancel = ({ setActiveTrace, setActiveMeasurement }) => {
  return (
    <div 
      className="flex italic text-blue-600 cursor-pointer"
      onClick={() => {
        setActiveMeasurement(null)
        setActiveTrace(null);
      }}
    >
      cancel
    </div>
  );
};

export function Sidebar() {
  const {activeTool, selectedMarker, 
         activeMeasurement, setActiveMeasurement,
         viewer, poles
        } = useJobContext();

  const [measurements, setMeasurements] = useState([]); // Initial state is empty

  useEffect(() => {
    // Update measurements based on the current length of poles
    setMeasurements(Array.from({ length: poles.length }, () => ({
      primaries: [],
      neutrals: [],
      secondaries: [],
      transformers: [],
      driploops: [],
      risers: [],
      comms: [],
    })))
  }, [poles]);

  console.log(measurements)

  const [activeTrace, setActiveTrace] = useState(null);
  const [primaries, setPrimaries] = useState([]);
  const [neutrals, setNeutrals] = useState([]);
  const [secondaries, setSecondaries] = useState([]);
  const [transformers, setTransformers] = useState([]);
  const [driploops, setDriploops] = useState([]);
  const [risers, setRisers] = useState([]);
  const [comms, setComms] = useState([]);

  function resetWireState() {
    setPrimaries([]);
    setNeutrals([]);
    setSecondaries([]);
    setTransformers([]);
    setDriploops([]);
    setRisers([]);
    setComms([]);
  }

  const [spinner, toggleSpinner] = useState<boolean>(false);

  const handleAddNewPrimary = (selectedMarker) => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        primaries: [...updatedMeasurements[index].primaries, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setPrimaries([...primaries, {}]);
  }

  const handleAddNewNeutral = (selectedMarker) => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        neutrals: [...updatedMeasurements[index].neutrals, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setNeutrals([...neutrals, {}]);
  }

  const handleAddNewSecondary = () => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        secondaries: [...updatedMeasurements[index].secondaries, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setSecondaries([...secondaries, {}]);
  }

  const handleAddNewTransformer = () => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        transformers: [...updatedMeasurements[index].transformers, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setTransformers([...transformers, {}]);
  }

  const handleAddNewDriploop = () => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        driploops: [...updatedMeasurements[index].driploops, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setDriploops([...driploops, {}]);
  }

  const handleAddNewRiser = () => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        risers: [...updatedMeasurements[index].risers, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setRisers([...risers, {}]);
  }

  const handleAddNewComm = () => {
    let index = selectedMarker.id;
    setMeasurements(prevMeasurements => {
      // Create a new array with the updated measurement
      const updatedMeasurements = [...prevMeasurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index], // Copy the existing measurement
        comms: [...updatedMeasurements[index].comms, {}] // Add an empty object to primaries
      };
      return updatedMeasurements;
    });
    
    setComms([...comms, {}]);
  }

  const handleDeletePrimary = (primary) => {
    setPrimaries(prevPrimary => prevPrimary.filter(item => item !== primary));
  };

  const handleDeleteNeutral = (neutral) => {
    setNeutrals(prevSecondaries => prevSecondaries.filter(item => item !== neutral));
  }

  const handleDeleteSecondary = (secondary) => {
    setSecondaries(prevSecondaries => prevSecondaries.filter(item => item !== secondary));
  }

  const handleDeleteTransformer = (transformer) => {
    setTransformers(prevTransformers => prevTransformers.filter(item => item !== transformer));
  }

  const handleDeleteDriploop = (driploop) => {
    setDriploops(prevDriploops => prevDriploops.filter(item => item !== driploop));
  }

  const handleDeleteRiser = (riser) => {
    setRisers(prevRisers => prevRisers.filter(item => item !== riser));
  }

  const handleDeleteComm = (comm) => {
    setComms(prevComms => prevComms.filter(item => item !== comm));
  }

  const handleAddMeasurement = (wire) => {
    if (activeTrace) return;
    setActiveTrace(wire);
    const newMeasurement = addMeasurement(viewer);
    setActiveMeasurement(newMeasurement);
  }

  // useEffect(() => {
  //   if (!activeMeasurement) return;
  //   const updatedPrimaries = [...primaries, activeMeasurement];
  //   setPrimaries(updatedPrimaries);
  //   console.log(primaries)
  //   toggleSpinner(false); // Stop the spinner
  //   console.log("Measurement updated:", activeMeasurement);
  // }, [activeMeasurement]);

  function confirmMeasurement(kind, markerId, index) {
    toggleSpinner(prev => !prev);
    setActiveTrace(null);

    if (kind === 'primary') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            primaries: updatedMeasurements[markerId].primaries.map((primary, i) => 
              i === index ? activeMeasurement : primary
            ),
          };
        }
    
        return updatedMeasurements;
      });
    } else if (kind === 'neutral') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            neutrals: updatedMeasurements[markerId].neutrals.map((neutral, i) => 
              i === index ? activeMeasurement : neutral
            ),
          };
        }
    
        return updatedMeasurements;
      });
    } else if (kind === 'secondary') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            secondaries: updatedMeasurements[markerId].secondaries.map((secondary, i) => 
              i === index ? activeMeasurement : secondary
            ),
          };
        }
    
        return updatedMeasurements;
      });
    } else if (kind === 'transformer') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            transformers: updatedMeasurements[markerId].transformers.map((transformer, i) => 
              i === index ? activeMeasurement : transformer
            ),
          };
        }
    
        return updatedMeasurements;
      });

    } else if (kind === 'riser') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            risers: updatedMeasurements[markerId].risers.map((riser, i) => 
              i === index ? activeMeasurement : riser
            ),
          };
        }
    
        return updatedMeasurements;
      });

    } else if (kind === 'driploop') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            driploops: updatedMeasurements[markerId].driploops.map((driploop, i) => 
              i === index ? activeMeasurement : driploop
            ),
          };
        }
    
        return updatedMeasurements;
      });
    } else if (kind === 'comm') {
      setMeasurements(prevMeasurements => {
        const updatedMeasurements = [...prevMeasurements];
        if (updatedMeasurements[markerId]) {
          updatedMeasurements[markerId] = {
            ...updatedMeasurements[markerId],
            comms: updatedMeasurements[markerId].comms.map((comm, i) => 
              i === index ? activeMeasurement : comm
            ),
          };
        }
    
        return updatedMeasurements;
      });

    }
  }

  return (
    <div className="w-1/5 shrink-0 bg-primary-foreground h-full text-sm overflow-auto">
        {selectedMarker?.type === "pole" ? (
          <div className="px-4 py-2 border-b">
            pole {selectedMarker.id + 1}
          </div>
        ) : selectedMarker?.type === "midspan" ? (
          <div className="px-4 py-2 border-b">
          'midspan'
          </div>
        ) : null}

        {selectedMarker && (
          <>
          <div className="px-4 py-2 border-b">
            pole {selectedMarker.id + 1}
          </div>
          <div className="px-4 py-2 border-b">
          <span>Lat/Long:    </span><span className="text-xs">{selectedMarker.lat} / {selectedMarker.lng}</span>
          </div>
          </>
        )}
        {selectedMarker && (
          <>
          <div className="flex flex-col gap-2 px-4 pr-12 py-2 border-b">
            <div className="text-red-600 italic">Existing Measurements:</div>
            <div className="flex text-xs justify-between">
              <span>Primary</span>
              <span 
                className="text-blue-600 italic cursor-pointer"
                onClick={() => handleAddNewPrimary(selectedMarker)}
              >
                add
              </span>
            </div>

          {/* PRIMARIES */}
          {measurements[selectedMarker.id]?.primaries?.map((primary, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {primary === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('primary', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Wire {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(primary)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {primary.points && primary.points.length > 0 && primary.points[0].HeightAboveGround
                        ? `${(primary.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeletePrimary(primary)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}

          {/* NEUTRALS */}
          <div className="flex text-xs justify-between">
            <span>Neutral</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={() => handleAddNewNeutral(selectedMarker)}
            >
              add
            </span>
          </div>
          {/* Neutrals */}
          {measurements[selectedMarker.id]?.neutrals?.map((neutral, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {neutral === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('neutral', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Wire {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(neutral)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {neutral.points && neutral.points.length > 0 && neutral.points[0].HeightAboveGround
                        ? `${(neutral.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteNeutral(neutral)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}


          {/* SECONDARY */}
          <div className="flex text-xs justify-between">
            <span>Secondary</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={handleAddNewSecondary}
            >
              add
            </span>
          </div>
          {measurements[selectedMarker.id]?.secondaries?.map((secondary, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {secondary === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('secondary', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Wire {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(secondary)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {secondary.points && secondary.points.length > 0 && secondary.points[0].HeightAboveGround
                        ? `${(secondary.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteSecondary(secondary)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}

          {/* TRANSFORMER */}
          <div className="flex text-xs justify-between">
            <span>Transformer</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={handleAddNewTransformer}
            >
              add
            </span>
          </div>
          {measurements[selectedMarker.id]?.transformers?.map((transformer, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {transformer === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('transformer', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Transformer {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(transformer, index)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {transformer.points && transformer.points.length > 0 && transformer.points[0].HeightAboveGround
                        ? `${(transformer.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteTransformer(transformer)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}

          {/* DRIP LOOP */}
          <div className="flex text-xs justify-between">
            <span>Drip loop</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={handleAddNewDriploop}
            >
              add
            </span>
          </div>
          {measurements[selectedMarker.id]?.driploops?.map((driploop, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {driploop === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('driploop', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Drip loop {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(driploop)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {driploop.points && driploop.points.length > 0 && driploop.points[0].HeightAboveGround
                        ? `${(driploop.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteDriploop(driploop)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}

          {/* Riser */}
          <div className="flex text-xs justify-between">
            <span>Riser</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={handleAddNewRiser}
            >
              add
            </span>
          </div>
          {measurements[selectedMarker.id]?.risers?.map((riser, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {riser === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('riser', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Riser {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(riser)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {riser.points && riser.points.length > 0 && riser.points[0].HeightAboveGround
                        ? `${(riser.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteRiser(riser)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}
          {/* COMMUNICATIONS */}
          <div className="flex text-xs justify-between">
            <span>Communcation</span>
            <span 
              className="text-blue-600 italic cursor-pointer"
              onClick={handleAddNewComm}
            >
              add
            </span>
          </div>
          {measurements[selectedMarker.id]?.comms?.map((comm, index) => (
            <div key={index} className="flex items-center justify-between pl-4 py-1 italic">
              {comm === activeTrace ? (
                <div className="flex w-full justify-between">
                  <WaitingDots />
                  <Check className="w-5 h-5 cursor-pointer" onClick={() => confirmMeasurement('comm', selectedMarker.id, index)}/>
                  <Cancel setActiveTrace={setActiveTrace} setActiveMeasurement={setActiveMeasurement}/>
                </div>
              ): (
                <>
                  <div className="flex items-center">
                    <div className="mr-4 text-xs">Wire {index + 1}:</div>
                    <div className="flex text-xs">
                      <div 
                        onClick={() => handleAddMeasurement(comm)}
                        className="text-blue-600 italic cursor-pointer"
                      >
                        {comm.points && comm.points.length > 0 && comm.points[0].HeightAboveGround
                        ? `${(comm.points[0].HeightAboveGround[0] * 3.28084).toFixed(1)} ft`
                        : 'select position'}
                      </div>
                    </div>
                  </div>
                  <X 
                    onClick={() => handleDeleteComm(comm)}
                    className="w-4 h-4 cursor-pointer" 
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 px-4 py-2 border-b">
          <div className="text-red-600 italic">Proposed Measurements:</div>
          <div className="text-xs">
            Primary
          </div>
          <div className="text-xs">
            Neutral
          </div>
          <div className="text-xs">
            Secondary
          </div>
          <div className="text-xs">
            Transformer
          </div>
          <div className="text-xs">
            Drip loop
          </div>
          <div className="text-xs">
            Riser
          </div>
          <div className="text-xs">
            Comm
          </div>
        </div>
        </>// 
        )}
    </div>
  )
}